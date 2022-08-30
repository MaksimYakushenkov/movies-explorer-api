const mongoose = require('mongoose');
const regularUrl = require('../utils/regular/regularUrl');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regularUrl.test(v);
      },
      message: 'Ссылка не прошла валидацию. Неверный формат.',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regularUrl.test(v);
      },
      message: 'Ссылка не прошла валидацию. Неверный формат.',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regularUrl.test(v);
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
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
