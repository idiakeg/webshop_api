const { Schema, model } = require("mongoose");

const orderSchema = new Schema({});

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;
