const mongoose = require('mongoose')
const schema = mongoose.Schema
const Categoria = require('./categoria')


const productSchema = new schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    image: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Categoria,
        required: true
    }
})

module.exports = mongoose.model('product', productSchema)