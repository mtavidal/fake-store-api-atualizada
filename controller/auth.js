const User = require('../model/user');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	if (email && password) {
		User.findOne({
			email: email,
			password: password,
		})
			.then((user) => {
				console.log(user)
				if (user) {
					res.json({
						token: jwt.sign({ user: email }, 'secret_key'),
						usuario: user,
					});
				} else {
					res.status(401);
					res.send('Senha ou usuário incorreto');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
};

module.exports.check = (req, res) => {
	const token = req.headers.authorization.replace("Bearer ", "");
	console.log(token)
	if (token) {
		const userToken = jwt.verify(token, 'secret_key');

		User.findOne({
			email: userToken.user,
		})
			.then((user) => {
				console.log(user)
				if (user) {
					res.json({
						usuario: user,
					});
				} else {
					res.status(401);
					res.send('username or password is incorrect');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
};
