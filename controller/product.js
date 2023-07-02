const Product = require('../model/product');
const Categoria = require('../model/categoria')

module.exports.getAllProducts = async (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const skip = Number(req.query.skip) || 0;
	const categoriaReq = Number(req.query.categoria) || null;
	let categoria = null;

	if (categoriaReq) {
		categoria = await Categoria.findOne({ id: categoriaReq }).select(['_id']);
	}

	const query = categoria ? { category: categoria._id } : {}

	const totalProdutos = await Product.count(query);

	Product.find(query)
		.populate('category')
		.select(['-_id'])
		.skip(skip)
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			const response = {
				total: totalProdutos,
				produtos: products
			}
			res.json(response);
		})
		.catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
	const id = req.params.id;

	Product.findOne({
		id,
	})
		.select(['-_id'])
		.then((product) => {
			res.json(product);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
	Product.distinct('category')
		.then((categories) => {
			res.json(categories);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
	const category = req.params.category;
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({
		category,
	})
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
	const limit = 1;
	const sort = -1;

	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		Categoria.findOne({ id: req.body.category }, function (err, cat) {
			console.log("cat", cat)
			Product.find()
				.select(['id'])
				.limit(limit)
				.sort({ id: sort })
				.then((products) => {
					console.log(products)
					const idSoma = products.length > 0 ? products[0].id + 1 : 1;
					console.log(idSoma)
					const product = {
						id: idSoma,
						title: req.body.title,
						price: req.body.price,
						description: req.body.description,
						image: req.body.image,
						category: cat,
					};
					Product.create(product)
						.then(product => res.json(product))
						.catch(err => console.log(err))
					res.json(product);
				})
				.catch((err) => console.log(err));
		});



	}
};

module.exports.editProduct = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		Categoria.findOne({ id: req.body.category }, function (err, cat) {
			Product.updateOne({ id: req.params.id }, {
				title: req.body.title,
				price: req.body.price,
				description: req.body.description,
				image: req.body.image,
				category: cat,
			})
				.then(function () { res.json({ id: req.params.id }) })
				.catch(function (error) { console.log(error) })
		})
	}

};

module.exports.deleteProduct = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Product.deleteOne({ id: req.params.id })
			.then(function () { res.json(req.params.id) })
			.catch(function (error) { console.log(error) })

	}
};
