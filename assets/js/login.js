const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Credenciales hardcoded
const VALID_USERNAME = 'juan';
const VALID_PASSWORD = '123';

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validar credenciales
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Guardar sesión en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Si no existe saldo inicial, establecerlo
        if (!localStorage.getItem('balance')) {
            localStorage.setItem('balance', '5000');
        }
        
        // Si no existe historial de transacciones, crear uno inicial
        if (!localStorage.getItem('transactions')) {
            const initialTransactions = [
                {
                    date: '2024-01-15',
                    concept: 'Depósito inicial',
                    amount: 5000
                },
                {
                    date: '2024-01-10',
                    concept: 'Transferencia recibida',
                    amount: 200
                },
                {
                    date: '2024-01-05',
                    concept: 'Pago de servicios',
                    amount: -150
                }
            ];
            localStorage.setItem('transactions', JSON.stringify(initialTransactions));
        }
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Mostrar error
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
});

