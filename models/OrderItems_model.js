const { Schema, model } = require("mongoose");

const OrderItemsSchema = new Schema({
	quantity: {
		type: Number,
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
});

const OrderItemsModel = model("OrderItems", OrderItemsSchema);

module.exports = OrderItemsModel;
