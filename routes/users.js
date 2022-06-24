const express = require('express');

const userRoutes = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = {
  userRoutes,
};
