const bcrypt = require('bcryptjs'); // импортируем bcrypt для хеширования пароля
const jwt = require('jsonwebtoken'); // импортируем jwt
const User = require('../models/user');
const { BadRequestError } = require('../utils/errors/bad-request-err');
const { ConflictError } = require('../utils/errors/conflict-err');
const { invalidProperties, emailIsUsed, emailIsUsedOtherUser } = require('../utils/errors/constantsError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.signout = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    res.send({
      token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '0s' }),
    });
  })
  .catch(next);

module.exports.getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(invalidProperties));
      }
      if (err.code === 11000) {
        return next(new ConflictError(emailIsUsed));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(invalidProperties));
      }
      if (err.codeName === 'DuplicateKey') {
        return next(new ConflictError(emailIsUsedOtherUser));
      }
      return next(err);
    });
};
