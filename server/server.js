const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Токен, который ты получил от BotFather
require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;
// Настройка сервера для обработки данных от Telegram
app.use(bodyParser.json());

app.get('/auth/telegram', (req, res) => {
  const { hash, ...data } = req.query;
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const checkString = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .sort()
    .join('\n');
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');

  if (hmac === hash) {
    res.json({ auth: true, user: data });
  } else {
    res.json({ auth: false });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
