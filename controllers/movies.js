const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }); // owner: req.user._id
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  const movie = await Movie.create({ owner: req.user._id, ...req.body });
  try {
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Ошибка введеных данных'));
      return;
    }
    next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const movieId = await Movie.findById(req.params.movieId);
    if (!movieId) {
      next(new NotFoundError('Карточка с указанным id не найдена'));
      return;
    }
    if (!movieId.owner.equals(req.user._id)) {
      next(new ForbiddenError('Чужая карточка'));
      return;
    }
    res.send(await Movie.findByIdAndRemove(movieId));
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
