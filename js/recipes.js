let allRecipes = []; // сюда сохраним все рецепты

// Функция для отрисовки списка рецептов
function renderRecipes(list) {
  const container = document.getElementById('recipe-list');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p>Рецепты не найдены.</p>';
    return;
  }

  list.forEach(recipe => {
    const div = document.createElement('div');
    div.className = 'recipe-card';
    div.innerHTML = `
    <h3>${recipe.title}</h3>
    <p><strong>Категория:</strong> ${recipe.category || 'Не указана'}</p>
    <p>${recipe.description}</p>
    <img src="${recipe.image}" alt="${recipe.title}" width="200" loading="lazy"><br>
    <button onclick="addToFavorites('${recipe._id}')">Добавить в избранное</button>
    `;

    container.appendChild(div);
  });
}

// Получаем рецепты с сервера, сохраняем и показываем
fetch('/recipes')
  .then(res => res.json())
  .then(data => {
    allRecipes = data;
    renderRecipes(allRecipes);
  })
  .catch(err => {
    console.error('Ошибка при загрузке рецептов:', err);
  });

// Добавление в избранное (оставляем твой код)
function addToFavorites(recipeId) {
  const username = localStorage.getItem('username');

  const audio = new Audio('sounds/click.mp3');
  audio.play();

  if (!username) return alert('Сначала войдите в систему');

  fetch('/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, recipeId })
  })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// Фильтр рецептов
function applyFilter() {
  const ingredientsInput = document.getElementById('ingredients').value.toLowerCase().trim();
  const categoryInput = document.getElementById('category').value;
  const timeInputRaw = document.getElementById('time').value;
  const timeInput = timeInputRaw ? parseInt(timeInputRaw, 10) : null;

  // Разбиваем ингредиенты из строки по запятым
  const ingredientsFilter = ingredientsInput
    ? ingredientsInput.split(',').map(i => i.trim()).filter(i => i !== '')
    : [];

  const filtered = allRecipes.filter(recipe => {
    // Категория (если выбрана)
    if (categoryInput && categoryInput !== '' && recipe.category !== categoryInput) {
      return false;
    }

    // Время (если введено)
    if (timeInput && recipe.time > timeInput) {
      return false;
    }

    // Проверяем ингредиенты — предполагаем, что recipe.ingredients это массив строк
    if (ingredientsFilter.length > 0) {
      if (!recipe.ingredients) return false; // если нет ингредиентов — не показываем

      for (let ing of ingredientsFilter) {
        // Ищем, есть ли ингредиент ing в списке рецепта (частичное совпадение)
        const hasIngredient = recipe.ingredients.some(i => i.toLowerCase().includes(ing));
        if (!hasIngredient) return false;
      }
    }

    return true;
  });

  renderRecipes(filtered);
}

// Вешаем обработчик на кнопку фильтра
document.getElementById('apply').addEventListener('click', applyFilter);
