const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');  // Подключаем mongoose для работы с MongoDB
const app = express();
const port = 3000;

// Токен, который вы получили от BotFather
require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;  // Подключаем строку подключения к MongoDB из .env

// Подключение к MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB подключен'))
  .catch(err => console.log('Ошибка подключения к MongoDB:', err));

// Настройка сервера для обработки данных от Telegram
app.use(bodyParser.json());

// Создаем схему и модель для пользователей
const UserSchema = new mongoose.Schema({
  telegramId: String,
  firstName: String,
  lastName: String,
  username: String,
  progress: Number,  // Для хранения прогресса пользователя
});

const User = mongoose.model('User', UserSchema);



// Маршрут для авторизации
app.get('/auth/telegram', async (req, res) => {
  const { hash, ...data } = req.query;
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const checkString = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .sort()
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');

  if (hmac === hash) {
    // Если проверка успешна, ищем или создаем пользователя в базе данных
    let user = await User.findOne({ telegramId: data.id });

    if (!user) {
      // Если пользователя нет, создаем нового
      user = new User({
        telegramId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        progress: 0  // Изначально прогресс 0
      });
      await user.save();  // Сохраняем нового пользователя
    }

    res.json({ auth: true, user });
  } else {
    res.json({ auth: false });
  }
});

// Маршрут для обновления прогресса пользователя
app.post('/update-progress', async (req, res) => {
  const { telegramId, newProgress } = req.body;

  try {
    // Находим пользователя по telegramId и обновляем его прогресс
    const user = await User.findOneAndUpdate(
      { telegramId },
      { progress: newProgress },
      { new: true }
    );

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка обновления прогресса', error });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
