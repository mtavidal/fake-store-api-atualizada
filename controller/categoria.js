const Categoria = require('../model/categoria');
const Product = require('../model/product');

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
		const nomeCategoria = `^${diacriticSensitiveRegex(req.body.nome)}$`
		const temCategoriaIgual = await Categoria.findOne({ nome: { $regex: nomeCategoria, $options: 'i' } });
		if (!temCategoriaIgual) {
			Categoria.find()
				.select(['id'])
				.limit(limit)
				.sort({ id: sort })
				.then((categorias) => {
					const idSoma = categorias.length > 0 ? categorias[0].id + 1 : 1;
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

module.exports.editCategoria = async (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		const nomeCategoria = `^${diacriticSensitiveRegex(req.body.nome)}$`
		const temCategoriaIgual = await Categoria.findOne({ id: { $ne: req.params.id }, nome: { $regex: nomeCategoria, $options: 'i' } });
		if (!temCategoriaIgual) {
			Categoria.updateOne({ id: req.params.id }, {
				nome: req.body.nome,
			})
				.then(function () { res.json({ id: req.params.id }) })
				.catch(function (error) { console.log(error) })
		} else {
			res.status(409).json({ mensagem: `Categoria '${req.body.nome}' já existe` })
		}
	}
};

module.exports.deleteCategoria = async (req, res) => {
	const objectIdCategoria = await Categoria.findOne({ id: req.params.id });
	const temProduto = await Product.findOne({ category: objectIdCategoria._id });

	console.log(temProduto)
	if (!temProduto) {
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
	} else {
		res.status(409).json({ mensagem: `Categoria com id:${req.params.id} possui produtos cadastrados, não pode ser deletada.` })
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