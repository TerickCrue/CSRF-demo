// Verificar si hay sesión activa
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = 'index.html';
}

// Actualizar saludo con el nombre del usuario
const username = localStorage.getItem('username') || 'Usuario';
document.getElementById('greeting').textContent = `Hola, ${username.charAt(0).toUpperCase() + username.slice(1)} Confiado`;

// Función para formatear número como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount);
}

// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Cargar y mostrar saldo
function loadBalance() {
    const balance = parseFloat(localStorage.getItem('balance')) || 5000;
    document.getElementById('balanceAmount').textContent = formatCurrency(balance);
}

// Cargar y mostrar transacciones
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionsList = document.getElementById('transactionsList');
    
    // Mostrar solo las últimas 3
    const lastThree = transactions.slice(0, 3);
    
    if (lastThree.length === 0) {
        transactionsList.innerHTML = '<li class="transaction-item"><span class="transaction-date" style="color: #888888;">No hay transacciones</span></li>';
    } else {
        transactionsList.innerHTML = lastThree.map(transaction => {
            const isPositive = transaction.amount > 0;
            const amountClass = isPositive ? 'positive' : 'negative';
            const amountSign = isPositive ? '+' : '';
            
            return `
                <li class="transaction-item">
                    <span class="transaction-date">${formatDate(transaction.date)}</span>
                    <span class="transaction-concept">${transaction.concept}</span>
                    <span class="transaction-amount ${amountClass}">${amountSign}${formatCurrency(Math.abs(transaction.amount))}</span>
                </li>
            `;
        }).join('');
    }
}

// Manejar formulario de transferencia
const transferForm = document.getElementById('transferForm');
const successAlert = document.getElementById('successAlert');

transferForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const destination = document.getElementById('destination').value.trim();
    const currentBalance = parseFloat(localStorage.getItem('balance')) || 5000;
    
    // Validar que el saldo sea suficiente
    if (amount > currentBalance) {
        alert('Saldo insuficiente');
        return;
    }
    
    // Actualizar saldo
    const newBalance = currentBalance - amount;
    localStorage.setItem('balance', newBalance.toString());
    
    // Agregar transacción
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const newTransaction = {
        date: new Date().toISOString().split('T')[0],
        concept: `Transferencia a ${destination}`,
        amount: -amount
    };
    
    // Agregar al inicio del array
    transactions.unshift(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Actualizar UI
    loadBalance();
    loadTransactions();
    
    // Mostrar alerta de éxito
    successAlert.classList.add('show');
    setTimeout(() => {
        successAlert.classList.remove('show');
    }, 3000);
    
    // Limpiar formulario
    transferForm.reset();
});

// Manejar cierre de sesión
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
});

// Cargar datos al iniciar
loadBalance();
loadTransactions();

