// Acknowledgments: code adapted from https://github.com/jonasschmedtmann/complete-node-bootcamp
class AppError extends Error {
  constructor (message, statusCode) {
    super(message);
    this.msg = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
