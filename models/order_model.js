const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
	OrderItems: [
		{
			type: Schema.Types.ObjectId,
			ref: "OrderItems",
			required: true,
		},
	],
	shippingAddress1: {
		type: String,
		required: true,
	},
	shippingAddress2: {
		type: String,
	},
	city: {
		type: String,
		required: true,
	},
	zip: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: "Pending",
	},
	totalPrice: {
		type: Number,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
});

orderSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

orderSchema.set("toJSON", {
	virtuals: true,
});

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;
