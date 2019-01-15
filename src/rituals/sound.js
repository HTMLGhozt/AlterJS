const mongoose   = require('mongoose');
const express = require('express');
const bcrypt     = require('bcrypt');

const Log	 = require('../log.js');

const UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: {
		type: String,
		unique: true,
		required: true
	},
	email:	  String,
	password: {
		type: String,
		required: true
	}
});

const User = mongoose.model('user', UserSchema);

module.exports = {
	path: '/',
	post: [
		express.urlencoded({
			extended: false
		}),
		(req, res, next) => {
			if (!req.body.password) return;
			let { username = null, email = null, password = null } = req.body;

			let registration = (!!username && !!email) ? true : false;
			if (registration) {
				password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
				let user = new User({
					_id: new mongoose.Types.ObjectId(),
					username: username,
					email: 	  email,
					password: password
				}); // needs alot more but i'd like to get a view soon

				user.save()
				 .then((result) => { console.log(result); })
				 .catch((e) 	=> { console.log(e); });
			} else {
				// detect which is valid username or email
				let queryField = (!!username) ? 'username' : 'email';
				let query      = null;
				User.find({ [queryField]: req.body[queryField] }, (e, docs) => {
					if (e) console.log(e);
					else query = docs; // TODO
				});
			};
		}
	]
};
