const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/[www.]?\S*#?/i.test(v);
      },
      message: 'Ссылка не прошла валидацию. Неверный формат.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/[www.]?\S*#?/i.test(v);
      },
      message: 'Ссылка не прошла валидацию. Неверный формат.',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/[www.]?\S*#?/i.test(v);
      },
      message: 'Ссылка не прошла валидацию. Неверный формат.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
