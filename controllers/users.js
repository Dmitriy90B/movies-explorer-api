const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const MONGOOSE_ERROR_CODE = 11000;

const createUser = async (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 8);
    const userCreate = new User({
      email,
      password: hash,
      name,
    });
    const savedUser = await userCreate.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Ошибка валидации'));
      return;
    }
    if (err.code === MONGOOSE_ERROR_CODE) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    next(new UnauthorizedError('Неверный логин или пароль'));
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    next(new UnauthorizedError('Неверный логин или пароль'));
    return;
  }
  try {
    res.send({
      token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    res.send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      return;
    }
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
};
