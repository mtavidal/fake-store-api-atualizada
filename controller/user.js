const User = require('../model/user');

module.exports.getAllUser = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	User.find()
		.select(['-_id'])
		.limit(limit)
		.sort({
			id: sort,
		})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
	const id = req.params.id;

	User.findOne({
		id,
	})
		.select(['-_id'])
		.then((user) => {
			res.json(user);
		})
		.catch((err) => console.log(err));
};

module.exports.addUser = async (req, res) => {
	const limit = 1;
	const sort = -1;
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		const emailUser = `^${diacriticSensitiveRegex(req.body.email)}$`
		const temEmailUserIgual = await User.findOne({ email: { $regex: emailUser, $options: 'i' } });
		if (!temEmailUserIgual) {
			User.find()
				.select(['id'])
				.limit(limit)
				.sort({ id: sort })
				.then((users) => {
					const idSoma = users.length > 0 ? users[0].id + 1 : 1;
					const userNew = new User({
						id: idSoma,
						email: req.body.email,
						password: req.body.password,
						name: req.body.name,
						type: req.body.type,
					});
					User.create(userNew)
						.then(user => res.json(user))
						.catch(err => console.log(err))
				})
				.catch((err) => console.log(err));
		} else {
			res.status(409).json({ mensagem: `Email '${req.body.email}' já é cadastrado.` })
		}
		//res.json({id:User.find().count()+1,...req.body})
	}
};

module.exports.editUser = async (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		const emailUser = `^${diacriticSensitiveRegex(req.body.email)}$`
		const temEmailUserIgual = await User.findOne({ id: { $ne: req.params.id }, email: { $regex: emailUser, $options: 'i' } });
		console.log(temEmailUserIgual)
		if (!temEmailUserIgual) {
			console.log(req.params.id)
			User.updateOne({ id: req.params.id }, {
				email: req.body.email,
				password: req.body.password,
				name: req.body.name,
				type: req.body.type,
			})
				.then(function () { res.json({ id: req.params.id }) })
				.catch(function (error) { console.log(error) })

			// res.json({

			// 	id: parseInt(req.params.id),
			// 	email: req.body.email,
			// 	password: req.body.password,
			// 	name: req.body.name,
			// 	type: req.body.type,
			// });
		} else {
			res.status(409).json({ mensagem: `Email '${req.body.email}' já é cadastrado.` })
		}
	}
};


module.exports.deleteUser = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		User.deleteOne({ id: req.params.id })
			.then(function () { res.json(req.params.id) })
			.catch(function (error) { console.log(error) })
		// User.findOne({ id: req.params.id })
		// 	.select(['-_id'])
		// 	.then((user) => {
		// 		res.json(user);
		// 	})
		// 	.catch((err) => console.log(err));
	}
};


function diacriticSensitiveRegex(string = '') {
	return string
		.replace(/a/g, '[a,á,à,ä,â]')
		.replace(/A/g, '[A,a,á,à,ä,â]')
		.replace(/e/g, '[e,é,ë,è]')
		.replace(/E/g, '[E,e,é,ë,è]')
		.replace(/i/g, '[i,í,ï,ì]')
		.replace(/I/g, '[I,i,í,ï,ì]')
		.replace(/o/g, '[o,ó,ö,ò]')
		.replace(/O/g, '[O,o,ó,ö,ò]')
		.replace(/u/g, '[u,ü,ú,ù]')
		.replace(/U/g, '[U,u,ü,ú,ù]');
}