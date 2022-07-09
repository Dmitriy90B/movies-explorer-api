require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes/index');

const { PORT = 3000 } = process.env;
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

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(ErrorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT);
}

main();
