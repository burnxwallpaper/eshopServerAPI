const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderModel = new Schema(
    {
        username: { type: String },
        products: { type: Object },
        date: { type: Date },
        orderId: { type: String },
        transport: { type: String },
        destination: { type: String },
    }
)

module.exports = mongoose.model('orderModel', orderModel, "order");