// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        // Сохраняем имя пользователя в localStorage
        localStorage.setItem('username', username);

        // Переход на страницу после входа
        window.location.href = 'afterLogin/main.html';
    } else {
        alert(result.message);
    }
});
