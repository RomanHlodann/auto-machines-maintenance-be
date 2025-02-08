const { default: mongoose } = require('mongoose');
const ApiError = require('./api-error');

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({'message': 'Invalid id'});
  }
  if (err.code === 11000) {
    return res.status(400).json({'message': 'Duplicated key. You already have an item with the same value'});
  }

  return res.status(500).json({'message': 'Something went wrong'});
}

module.exports = apiErrorHandler;
