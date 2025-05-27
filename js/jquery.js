$(document).ready(function() {
    // 1. Изменить стиль и текст
    $('.intro p').text('Новые вкусные рецепты обновляются каждую неделю!').css('fontStyle', 'italic');
    
    // 2. Анимации
    $('.hero-image img').hide().fadeIn(1500);        // плавное появление
    $('.news h3').click(function() {
      $(this).next('ul').slideToggle();             // сворачивание/разворачивание списка
    });
    
    // 3. Добавление/удаление элементов
    $('#add-news').on('click', function() {
      $('.news ul').append('<li>Новость добавлена через jQuery!</li>');
    });
    
    // 4. Ещё один слушатель события
    $('.category-card').hover(
      function() { $(this).addClass('shadow-lg'); },
      function() { $(this).removeClass('shadow-lg'); }
    );
    
    // 5. AJAX-пример (для демонстрации; можно заменить на свой endpoint)
    $('#random-recipe').on('click', function() {
      $.getJSON('https://api.sampleapis.com/recipes/recipes', function(data) {
        const recipe = data[Math.floor(Math.random() * data.length)].title;
        alert('Случайный рецепт: ' + recipe);
      });
    });
  });
  