/* eslint-disable linebreak-style */
/* eslint-disable strict */

'use strict';

const _mongoose = _interopRequireDefault(require('mongoose'));

const _constants = _interopRequireDefault(require('./config/constants'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

// Use native promises
_mongoose['default'].Promise = global.Promise; // Connect to our mongo database;

_mongoose['default'].connect(_constants['default'].mongo.uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

_mongoose['default'].connection.on('error', function(err) {
  throw err;
});
