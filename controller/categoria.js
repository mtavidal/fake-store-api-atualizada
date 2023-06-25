const Categoria = require('../model/categoria');

module.exports.getAllCategoria = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Categoria.find()
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((categorias) => {
			res.json(categorias);
		})
		.catch((err) => console.log(err));
};

module.exports.getCategoria = (req, res) => {
	const id = req.params.id;

	Categoria.findOne({
		id,
	})
		.select(['-_id'])
		.then((categoria) => {
			res.json(categoria);
		})
		.catch((err) => console.log(err));
};


module.exports.addCategoria = async (req, res) => {
	const limit = 1;
	const sort = -1;

	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		const temCategoriaIgual = await Categoria.findOne({ nome: req.body.nome });
		if (!temCategoriaIgual) {
			Categoria.find()
				.select(['id'])
				.limit(limit)
				.sort({ id: sort })
				.then((categorias) => {
					console.log(categorias)
					const idSoma = categorias.length > 0 ? categorias[0].id + 1 : 1;
					console.log(idSoma)
					const categoria = {
						id: idSoma,
						nome: req.body.nome,
					};
					Categoria.create(categoria)
						.then(categoria => res.json(categoria))
						.catch(err => console.log(err))
				})
				.catch((err) => console.log(err));
		} else {
			res.status(409).json({ mensagem: `Categoria '${req.body.nome}' já existe` })
		}
	}
};

module.exports.editCategoria = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		Categoria.updateOne({ id: req.params.id }, {
			nome: req.body.nome,
		})
			.then(function () { res.json({ id: req.params.id }) })
			.catch(function (error) { console.log(error) })
	}
};

module.exports.deleteCategoria = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		Categoria.deleteOne({ id: req.params.id })
			.then(function () { res.json(req.params.id) })
			.catch(function (error) { console.log(error) })

	}
};
