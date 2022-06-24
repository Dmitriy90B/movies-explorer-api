const express = require('express');

const movieRoutes = express.Router();
const { celebrate, Joi } = require('celebrate');

const regEx = /https?:\/\/(www\.)?[0-9A-Za-z-.]*\.[A-Za-z-.]{2,}([0-9A-Za-z-._~:/?#[\]@!$&'()*+,;=])*#*$/;
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
    image: Joi.string().required().pattern(regEx),
    trailerLink: Joi.string().required().pattern(regEx),
    thumbnail: Joi.string().required(2).pattern(regEx),
    movieId: Joi.string().required().length(24).hex(),
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
