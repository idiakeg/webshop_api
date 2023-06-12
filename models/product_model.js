const { Schema, model } = require("mongoose");

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	richDescription: {
		type: String,
		defualt: "",
	},
	image: {
		type: String,
		default: "",
	},
	images: [
		{
			type: String,
		},
	],
	brand: {
		type: String,
		default: "",
	},
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	countInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 300,
	},
	rating: {
		type: Number,
		default: 0,
	},
	numReviews: {
		type: Number,
		default: 0,
	},
	isFeatured: {
		type: Boolean,
		default: false,
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
});

// Duplicate the ID field.
productSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set("toJSON", {
	virtuals: true,
});

const Products = model("Product", productSchema);

module.exports = Products;
