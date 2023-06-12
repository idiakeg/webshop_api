const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
	},
	icon: {
		type: String,
	},
});

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel;
