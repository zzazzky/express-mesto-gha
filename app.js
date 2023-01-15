const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { handleError } = require('./utils/errorhandler');

const { PORT = 3000 } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', (req, res, next) => {
  req.body.user = {
    _id: '63c014b90941ad5cb3524c22',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(handleError);

app.listen(PORT);
