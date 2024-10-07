const mongoose = require('mongoose');

// Описание схемы данных пользователя
const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  username: String,
  orex: { type: Number, default: 0 },
  xiom: { type: Number, default: 0 }
});

// Создание модели пользователя на основе схемы
const User = mongoose.model('User', userSchema);

module.exports = User;
