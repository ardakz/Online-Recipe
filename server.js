const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Подключаем MongoDB (оставляем как было)
mongoose.connect('mongodb://localhost:27017/culinaryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Определяем модель User
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

// Модель рецепта
const Recipe = mongoose.model('Recipe', new mongoose.Schema({
  title: String,
  description: String,
  image: String,
}));

// Модель избранного
const Favorite = mongoose.model('Favorite', new mongoose.Schema({
  username: String,
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
}));


// Получить все рецепты
app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// Добавить в избранное
app.post('/favorites', async (req, res) => {
  const { username, recipeId } = req.body;
  await new Favorite({ username, recipeId }).save();
  res.json({ message: 'Добавлено в избранное' });
});

// Получить избранные рецепты
app.get('/favorites/:username', async (req, res) => {
  const username = req.params.username;
  const favorites = await Favorite.find({ username }).populate('recipeId');
  const recipes = favorites.map(fav => ({
    _id: fav._id, // ID документа избранного
    title: fav.recipeId.title,
    description: fav.recipeId.description,
    image: fav.recipeId.image,
    recipeId: fav.recipeId._id
  }));
  res.json(recipes);
});


// POST /favorites - Убрать Дубликаты

app.post('/favorites', async (req, res) => {
  const { username, title, image, time } = req.body;

  try {
    const existing = await Favorite.findOne({ username, title });
    if (existing) {
      return res.status(409).json({ message: 'Рецепт уже добавлен' }); // 409 = Conflict
    }

    const newFavorite = new Favorite({ username, title, image, time });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Удаление из базы данных ИЗБРАННЫЕ
app.delete('/favorites/:username/:id', async (req, res) => {
  const { username, id } = req.params;
  await Favorite.deleteOne({ _id: id, username });
  res.sendStatus(200);
});

// DELETE /favorites/:id
app.delete('/favorites/:id', async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Роут на регистрацию
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json({ message: 'Пользователь уже существует' });
  }
  await new User({ username, password }).save();
  res.json({ message: 'Регистрация успешна' });
});

// Роут на вход
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) {
    return res.json({ message: 'Неверное имя пользователя или пароль', success: false });
  }
  res.json({ message: 'Вход успешен', success: true });
});

// --- СТАТИЧЕСКИЕ РЕСУРСЫ ---
// Отдаём весь каталог beforeLogin по корню
app.use(express.static(path.join(__dirname, 'beforeLogin')));
// Отдаём весь каталог afterLogin по URL /afterLogin
app.use('/afterLogin', express.static(path.join(__dirname, 'afterLogin')));
// Отдаём CSS, JS и картинки
app.use('/css',    express.static(path.join(__dirname, 'afterLogin', 'css')));
app.use('/js',     express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'afterLogin', 'images')));

// Если зайдут на корень, покажем index.html из beforeLogin
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'beforeLogin', 'index.html'));
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
