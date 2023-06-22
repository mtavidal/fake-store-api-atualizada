const mongoose = require('mongoose')
const schema = mongoose.Schema
const Product = require('./product')
const User = require('./user')

const cartSchema = new schema({
    id: {
        type: Number,
        required: true
    },
    userId: {
        type: schema.Types.Number,
        ref: User,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    produtos: [
        {
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
            category: String,
            quantidade: Number,
        }
    ]
})

module.exports = mongoose.model('cart', cartSchema)