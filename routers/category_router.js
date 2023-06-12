const { Router } = require("express");
const CategoryModel = require("../models/category_model");

const router = Router();

router.get("/", async (req, res) => {
	try {
		const categoryList = await CategoryModel.find({});
		res.status(200).json(categoryList);
	} catch (error) {
		res.status(501).json({
			error,
			success: false,
		});
	}
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const category = await CategoryModel.findById(id);
		if (!category) {
			return res.status(400).json({
				success: false,
				message: "category with not found!",
			});
		}
		res.status(200).json({
			success: true,
			category,
		});
	} catch (error) {}
});

router.post("/", async (req, res) => {
	const { name, color, icon } = req.body;
	try {
		const category = await CategoryModel.create({
			name,
			color,
			icon,
		});
		if (!category) {
			return res.status(400).json({
				success: false,
				message: "This category cannot be created",
			});
		}
		res.status(200).json({
			success: true,
			category,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { name, color, icon } = req.body;
	try {
		const category = await CategoryModel.findByIdAndUpdate(
			id,
			{
				name,
				color,
				icon,
			},
			{
				new: true,
			}
		);
		if (!category) {
			return res.status(400).json({
				success: false,
				message: "category not found!",
			});
		}

		res.status(200).json({
			success: true,
			category,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const category = await CategoryModel.findByIdAndDelete(id);
		if (!category) {
			// this bloack of code runs when the user enters an Id that is valid but doesnot exist in our database
			return res.status(404).json({
				success: false,
				message: "category not found!",
			});
		}
		res.status(200).json({
			success: true,
			message: "Category was deleted!",
		});
	} catch (error) {
		// this block of code runs when a wrong format of the id is used, mongoose has a define id format
		res.status(500).json({
			success: false,
			error,
		});
	}
});

module.exports = router;
