require('dotenv').config(); // Загружаем переменные окружения

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Подключаем mongoose для работы с MongoDB
const orexRoutes = require('./routes/orex'); // Подключаем маршрут для Orex

const app = express();
const port = 3000;

// Логирование всех запросов
app.use((req, res, next) => {
  console.log('Запрос от клиента:', req.method, req.url);
  next();
});

// Получаем переменные окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const MONGO_URI = process.env.MONGO_URI;

console.log('BOT_TOKEN:', BOT_TOKEN);
console.log('MONGO_URI:', MONGO_URI);

// Подключение к MongoDB (убраны устаревшие опции)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB подключен'))
  .catch(err => console.log('Ошибка подключения к MongoDB:', err));

// Настройка сервера для обработки данных от Telegram
app.use(bodyParser.json());
app.use('/api/orex', orexRoutes); // Используем роут для orex

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
