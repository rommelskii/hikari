const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.schema(
	{
		username: {
			type: String,
			required: [true, 'Please input a username'],
			trim: true
		},
		password: {
			type: String,
			required: [true, 'Please input a password'],
			minlength: [6, 'Password must at least be 6 characters long'],
			select: false
		},
		role: {
			type: String,
			enum: ['user','admin'],
			default: 'user'
		}
	},
	{
		timestamps: true
	}
);
