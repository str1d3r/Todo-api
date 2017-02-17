var _ = require('underscore');
var bcrypt = require('bcrypt');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			defaultValue: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (_.isString(user.email))
					user.email = user.email.toLowerCase();

			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {

					if (body.hasOwnProperty('email') && body.hasOwnProperty('password') && _.isString(body.email) && _.isString(body.password)) {
						user.findOne({
							"where": {
								"email": body.email
							}
						}).then(function(user) {
							if (user && bcrypt.compareSync(body.password, user.get('password_hash'))) {
								return resolve(user);
							} else
								return reject();
						}, function(user) {
							return reject();
						});
					} else {
						return reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jwt.sign({
							token: encryptedData
						},
						'qwerty098'
					);
					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});
	return user;
}
