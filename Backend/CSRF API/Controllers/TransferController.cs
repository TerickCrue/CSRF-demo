using CSRF_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CSRF_API.Controllers
{
    [ApiController]
    [Route("api")]
    public class TransferController : ControllerBase
    {
        private readonly LedgerService _ledger;

        public TransferController(LedgerService ledger)
        {
            _ledger = ledger;
        }

        // VULNERABLE endpoint: usa GET para cambiar estado (intencional).
        //transferir
        [HttpGet("transfer")]
        public IActionResult Transfer([FromQuery] string amount, [FromQuery] string recipient)
        {
            var user = Request.Cookies["session_user"];
            if (string.IsNullOrEmpty(user))
            {
                return Unauthorized("No autenticado. Llama a /api/auth/login?user=tuNombre primero.");
            }

            if (string.IsNullOrEmpty(amount))
            {
                return BadRequest("Especifica ?amount=NNN");
            }

            if (string.IsNullOrEmpty(recipient))
            {
                return BadRequest("Especifica ?recipient=DESTINO");
            }

            var entry = $"User {user} transferred {amount} to {recipient} at {DateTime.UtcNow:u}";
            _ledger.Add(entry);

            var html = $@"<html><body>
                <p>Transferencia realizada: {System.Net.WebUtility.HtmlEncode(entry)}</p>
                <p><a href=""/api/ledger"">Ver ledger</a></p>
                </body></html>";

            return Content(html, "text/html");
        }

        // Mostrar ledger
        [HttpGet("ledger")]
        public IActionResult Ledger()
        {
            var items = _ledger.GetAll()
                .Select(i => System.Net.WebUtility.HtmlEncode(i));

            var html = "<html><body><h2>Ledger</h2><ul>";
            foreach (var it in items) html += $"<li>{it}</li>";
            html += "</ul></body></html>";

            return Content(html, "text/html");
        }

        // Reset ledger
        [HttpGet("reset")]
        public IActionResult Reset()
        {
            _ledger.Reset();
            return Content("<p>Ledger reseteado</p>", "text/html");
        }
    }
}
