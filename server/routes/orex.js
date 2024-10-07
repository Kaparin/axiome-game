const express = require('express');
const router = express.Router();
const User = require('../models/user');  // Модель пользователя

// Маршрут для получения данных о Orex и Xiom для конкретного пользователя
router.get('/:telegramId', async (req, res) => {
  const { telegramId } = req.params;

  try {
    // Поиск пользователя по Telegram ID
    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    res.json({ success: true, orex: user.orex, xiom: user.xiom });
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    res.status(500).json({ success: false, message: 'Ошибка получения данных', error: error.message });
  }
});

// Маршрут для обновления Orex и Xiom
router.post('/update', async (req, res) => {
  const { telegramId, firstName, lastName, username, orex, xiom } = req.body;

  // Проверяем, что все необходимые поля переданы
  if (!telegramId || orex == null || xiom == null) {
    return res.status(400).json({ success: false, message: 'Необходимо передать все обязательные поля: telegramId, orex, xiom' });
  }

  try {
    // Обновляем пользователя или создаем нового, если его нет
    const user = await User.findOneAndUpdate(
      { telegramId },
      { firstName, lastName, username, orex, xiom },
      { new: true, upsert: true }  // upsert: true создаст нового пользователя, если его нет
    );

    console.log('Созданный или обновлённый пользователь:', user);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Ошибка при создании или обновлении пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка обновления данных', error: error.message });
  }
});

module.exports = router;
