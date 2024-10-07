const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Подключаем модель пользователя

// Получение данных о Orex и Xiom
router.get('/:telegramId', async (req, res) => {
  const { telegramId } = req.params;

  try {
    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    res.json({ success: true, orex: user.orex, xiom: user.xiom });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка получения данных', error });
  }
});

// Обновление Orex и Xiom
router.post('/update', async (req, res) => {
  const { telegramId, orex, xiom } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { orex, xiom },
      { new: true }
    );

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка обновления данных', error });
  }
});

module.exports = router;
