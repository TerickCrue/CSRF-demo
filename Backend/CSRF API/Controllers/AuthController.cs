using Microsoft.AspNetCore.Mvc;

namespace CSRF_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        [HttpGet("login")]
        public IActionResult Login([FromQuery] string user)
        {
            if (string.IsNullOrWhiteSpace(user)) user = "guest";

            // Establecemos cookie de sesión (HttpOnly).
            // Intencionalmente NO establecemos SameSite ni Secure (solo PARA DEMO local).
            Response.Cookies.Append("session_user", user, new CookieOptions
            {
                HttpOnly = true,
                // SameSite intentionally not set for the vulnerable demo
                // Secure = false (for local http)
            });

            var html = $@"<html><body>
                <h3>Logged in as <b>{System.Net.WebUtility.HtmlEncode(user)}</b></h3>
                <p>Cookie <code>session_user</code> establecida (HttpOnly).</p>
                <p>Usa /api/transfer?amount=NNN para transferir (demo vulnerable).</p>
                <p><a href=""/api/ledger"">Ver ledger</a></p>
                </body></html>";

            return Content(html, "text/html");
        }

        //logout (borra cookie)
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("session_user");
            return Content("<p>Logged out</p>", "text/html");
        }
    }
}
