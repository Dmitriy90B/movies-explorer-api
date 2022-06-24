require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const { userRoutes } = require('./routes/users');
const { movieRoutes } = require('./routes/movies');
const { validateSignUp, validateSignIn } = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const ErrorHandler = require('./errors/ErrorHandler');

const app = express();
app.use(requestLogger);
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:4000',
  }),
);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use('/users', auth, userRoutes);
app.use('/movie', auth, movieRoutes);
app.use(auth, () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use(ErrorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT);
}

main();
