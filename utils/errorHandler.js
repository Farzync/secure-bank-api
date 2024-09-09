// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Default response
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Handle SyntaxError (misalnya JSON yang tidak valid)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      statusCode = 400;
      message = 'Invalid JSON format';
    }
  
    // Sequelize Validation Errors
    if (err.name === 'SequelizeValidationError') {
      statusCode = 400;
      message = err.errors.map((e) => e.message);
    }
  
    // Unique constraint error (misalnya email atau username sudah ada)
    if (err.name === 'SequelizeUniqueConstraintError') {
      statusCode = 400;
      message = err.errors.map((e) => e.message);
    }
  
    // Handle specific JWT errors (e.g., Token expired, Invalid token)
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
  
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
  
    // Kirim response error
    res.status(statusCode).json({
      message: message || 'An unexpected error occurred',
      error: err.stack
    });
  };
  
  module.exports = errorHandler;
  