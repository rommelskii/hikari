const ErrorResponse = require('../utils/errorResponse');

/**
	*@param {Error} err
	*@param {import('express').Request} req
	*@param {import('express').Response} res
	*@param {import('express').NextFunction} next 
	*
	*/

const errorHandler = (err, req, res, next) => {
	if (err.stack) console.error(err.stack);
	else console.error(err);

	let error = { ...err };
	error.message = err.message;

	let statusCode = err.statusCode || 500;
	let message = err.message || 'Server error';

	// handling mongoose errors

	if (err.name === 'CastError') {
		message = `Resource not found with id ${err.value}`;
		statusCode = 404;
		error = new ErrorResponse(message, statusCode);
	}

	//duplicate entry
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		message = `Duplicate entry found for id ${field}`;
		statusCode = 400;
		error = new ErrorResponse(message, statusCode);
	}

	if (err.name === 'ValidationError') {
		const messages = Object.values(err.errors).map(val => val.message);
		message = messages.join('. ');
		statusCode = 400;
		error = new ErrorResponse(message, statusCode);
	}

	if (err.name === 'JsonWebTokenError') {
		message = 'Not authorized: invalid token';
		statusCode = 401;
		error = new ErrorResponse(message, statusCode);
	}

	if (err.name === 'TokenExpiredError') {
		message = 'Not authorized: token has expired';
		statusCode = 401;
		error = new ErrorResponse(message, statusCode);
	}

	res.status(statusCode).json({
		success: false,
		error: message
	});
}

module.exports = errorHandler;
