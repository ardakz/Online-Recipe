// register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
  
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    const result = await response.json();
  
    if (result.message === 'Регистрация успешна') {
      // Показать сообщение
      alert('Вы прошли регистрацию успешно!');
      // Закрыть модалку
      const modalEl = document.getElementById('registerModal');
      const modal = bootstrap.Modal.getInstance(modalEl) 
                    || new bootstrap.Modal(modalEl);
      modal.hide();
      // Можно очистить форму, если нужно:
      document.getElementById('registerForm').reset();
    } else {
      // Пользователь уже существует
      alert(result.message);
    }
  });
  