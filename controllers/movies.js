const Movie = require('../models/movie');
const { NotFoundError } = require('../utils/errors/not-found-err');
const { BadRequestError } = require('../utils/errors/bad-request-err');
const { AuthorizedButForbidden } = require('../utils/errors/authorized-but-forbidden');
const {
  invalidProperties,
  incorrectFormatId,
  cantDeleteOtherMovie,
  movieIsDeleted,
  notFoundMovieId,
} = require('../utils/errors/constantsError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(invalidProperties));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieId);
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new AuthorizedButForbidden(cantDeleteOtherMovie);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send({ message: movieIsDeleted }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(incorrectFormatId));
      }
      return next(err);
    });
};
