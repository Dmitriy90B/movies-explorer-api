const express = require('express');

const movieRoutes = express.Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const regExp = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message('не является URL адресом');
};

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(regExp),
    trailerLink: Joi.string().required().custom(regExp),
    thumbnail: Joi.string().required(2).custom(regExp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
}), createMovie);

movieRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = {
  movieRoutes,
};
