// Загружаем избранные рецепты
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Пожалуйста, войдите в систему');
    return;
  }

  fetch(`/favorites/${username}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('favorites-list');
      container.innerHTML = '';

      if (data.length === 0) {
        container.innerHTML = '<p>У вас пока нет избранных рецептов.</p>';
        return;
      }

      data.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.innerHTML = `
          <h3>${recipe.title}</h3>
          <p>${recipe.description || ''}</p>
          <img src="${recipe.image}" alt="${recipe.title}" width="200"><br>
          <button onclick="removeFromFavorites('${recipe._id}')">Удалить из избранного</button>
        `;
        container.appendChild(div);
      });
    });
});

// Удаляем рецепт из избранного
function removeFromFavorites(recipeId) {
  const username = localStorage.getItem('username');
  if (!username) {
    alert('Пожалуйста, войдите в систему');
    return;
  }

  // Найдём ID объекта Favorite по username и recipeId
  fetch(`/favorites/${username}`)
    .then(res => res.json())
    .then(favorites => {
      const fav = favorites.find(f => f._id === recipeId || f.recipeId?._id === recipeId);
      if (!fav) return alert('Рецепт не найден в избранном');

      const idToDelete = fav._id;

      fetch(`/favorites/${username}/${idToDelete}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            alert('Удалено из избранного');
            location.reload(); // Обновить список
          } else {
            alert('Ошибка при удалении');
          }
        });
    });
}
