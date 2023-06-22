const mongoose = require('mongoose')
const schema = mongoose.Schema

const categoriaSchema = new schema({
    id: {
        type: Number,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('categoria', categoriaSchema)