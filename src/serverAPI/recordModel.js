const mongoose = require('mongoose');

const { Schema } = mongoose;

const productModel = new Schema(
    {
        name: { type: String },
        price: { type: Number },
        date: { type: Date },
        category: { type: String },

        image: { type: String },

    }
)

module.exports = mongoose.model('Product', productModel, "products");