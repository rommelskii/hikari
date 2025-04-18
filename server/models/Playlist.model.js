const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SongSchema = new mongoose.schema(
	{
		name: {
			type: String,
			required: [true, 'Enter a valid song name'],
		},
		artist: {
			type: String,
			required: [true, 'Enter a valid song artist'],
		}
	}
);

const PlaylistSchema = new mongoose.schema(
	{
		name: {
			type: String,
			required: [true, 'Enter a valid playlist name'],
		},
		description: {
			type: String, 
		},
		content: [SongSchema]
	}, 
	{
		timestamps: true
	}
);

