const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.string().required().min(2),
    year: Joi.string().required().length(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(/^https?:\/\/[www.]?\S/i),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/[www.]?\S/i),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/[www.]?\S/i),
    movieId: Joi.string().hex().length(24),
  }),
}), createMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteMovie);

module.exports = router;
