const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();

// Ваш токен, полученный от BotFather
const BOT_TOKEN = '7737584623:AAEzvlRqZqYlBMGmBf7LgcNV4cMy7KRS3-M';

// Инициализация бота
const bot = new Telegraf(BOT_TOKEN);

// Настройка WebApp, чтобы при нажатии на кнопку открывалось приложение
bot.command('start', (ctx) => {
  // Отправка кнопки для открытия WebApp
  return ctx.reply('Нажмите для открытия WebApp', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть WebApp',
            web_app: { url: 'https://ape-excited-seagull.ngrok-free.app' }, // URL вашего приложения
          },
        ],
      ],
    },
  });
});

// Обработка данных, отправляемых из WebApp
bot.on('message', (ctx) => {
  if (ctx.message?.web_app_data?.data) {
    const data = ctx.message.web_app_data.data;
    ctx.reply(`Получены данные из WebApp: ${data}`);
  } else {
    ctx.reply('Сообщение не содержит данных из WebApp');
  }
});

// Запуск бота
bot.launch();

// Express сервер для Webhook (если используете)
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Webhook для Telegram (используйте, если хотите работать через Webhook)
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
