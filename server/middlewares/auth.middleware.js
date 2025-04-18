const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User.model'); // Adjust path as needed

const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || 'token';

exports.protect = asyncHandler(async (req,res,next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer');
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	else if (req.cookies && req.cookies[JWT_COOKIE_NAME]) {
		token = req.cookies[JWT_COOKIE_NAME];
	}


	if (!token) {
		return next(new ErrorResponse("Not authorized to access route (no token)", 401));
	}

	// if everything is good
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select('-password');

		if (!req.user) {
			return ( new ErrorResponse("User not found with given token", 401) );
		}

		next();

	} catch (error) {
		return next(err);
	}
});

exports.authorize = (...roles) => {
	return (req,res,next) => {
		if (!req.user) { //if no authentication token 
			return new ErrorResponse('Authentication required before authorization check', 401);
		}

		if (!req.user.role) { //if no role
			return new ErrorResponse(`Authorization error: User ${req.user.id} has no defined`, 403);	
		}

		if ( !roles.includes(req.user.role) ) {
			return next(

				new ErrorResponse(
					`Authorization error: 
					User ${req.user.id} does not have the appropriate role for action`, 403
				)
			);
		}
		next();
	};
};

exports.isAdmin = exports.authorize('admin');

