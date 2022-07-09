const express = require('express');
const { celebrate, Joi } = require('celebrate');

const routes = express.Router();
const { userRoutes } = require('./users');
const { movieRoutes } = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);
routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routes.use('/users', auth, userRoutes);
routes.use('/movies', auth, movieRoutes);
routes.use(auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = {
  routes,
};
