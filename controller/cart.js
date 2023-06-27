const Cart = require('../model/cart');

module.exports.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();
	const skip = Number(req.query.skip) || 0;
	let totalPedidos = 0;

	console.log(startDate, endDate);

	Cart.countDocuments({}, function (err, count) {
		if (err) { console.log(err) }
		else totalPedidos = count
	});

	Cart.find({
		data: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -produtos._id')
		.skip(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			const response = {
				total: totalPedidos,
				carts: carts
			}
			console.log(carts)
			console.log(response)
			res.json(response);
		})
		.catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = (req, res) => {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate, userId);
	Cart.find({
		userId: userId,
		// date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
	const id = req.params.id;
	Cart.findOne({
		id,
	})
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
};

module.exports.addCart = (req, res) => {
	const limit = 1;
	const sort = -1;

	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		Cart.find()
			.select(['id'])
			.limit(limit)
			.sort({ id: sort })
			.then((carts) => {
				console.log(carts)
				const novoId = carts.length > 0 ? carts[0].id + 1 : 1;

				const cart = {
					id: novoId,
					userId: req.body.userId,
					data: new Date(),
					produtos: req.body.products,
				};
				Cart.create(cart)
					.then(cart => res.json(cart))
					.catch(err => console.log(err))
			})
			.catch((err) => console.log(err));
	}
};

module.exports.editCart = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		});
	}
};

module.exports.deleteCart = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Cart.deleteOne({ id: req.params.id })
			.then(function () { res.json(req.params.id) })
			.catch(function (error) { console.log(error) })
	}
};
