const { Router } = require("express");
const CategoryModel = require("../models/category_model");
const ProductModel = require("../models/product_model");

const router = Router();

// Products route
router.get("/", async (req, res) => {
	let filter = {};
	try {
		if (req.query.category) {
			filter = { category: req.query.category.split(",") };
		}
		// the "select" method defines what info about the product should be available when a user visits this route. In this case, we have limited it to just the "name" and "description". If the user wants to get more information about the product, tey would have to visit the route for the particular product i.e /:id
		const productList = await ProductModel.find(filter).select(
			"name description"
		);
		if (!productList) {
			return res.status(501).json({
				success: false,
			});
		}
		res.status(200).json({
			success: true,
			productList,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

// get single product
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const product = await ProductModel.findById(id).populate("category");

		if (!product) {
			return res.status(400).json({
				success: false,
				message: "Cannot find product!",
			});
		}

		res.status(200).json({
			success: true,
			product,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

// create product
router.post("/", async (req, res) => {
	// recall that in the product schema, we are using a reference for the category, and this reference is obtianed by the category Id. what we do in the code below is obtain the category Id from the category model. Id the Id doesnot exist in the category model we then inform the user that they have provided an invalid category.
	const category = await CategoryModel.findById(req.body.category);
	if (!category) {
		return res.status(400).json({
			success: false,
			message: "Invalid category!",
		});
	}
	// obtain the payload
	const {
		name,
		description,
		richDescription,
		image,
		images,
		brand,
		price,
		countInStock,
		rating,
		numReviews,
		isFeatured,
		dateCreated,
	} = req.body;
	try {
		const product = await ProductModel.create({
			name,
			description,
			richDescription,
			image,
			images,
			brand,
			price,
			category,
			countInStock,
			rating,
			numReviews,
			isFeatured,
			dateCreated,
		});
		res.status(201).json({
			status: "success",
			product,
		});
	} catch (error) {
		res.status(501).json({
			success: false,
			error,
		});
	}
});

// update product
router.put("/:id", async (req, res) => {
	// validate the category, use the category field present in the body of the request as it contains the corresponding Id as defined by the schema. Donot use the id from the req.params for validation as this id is not present in the category document/collection
	const category = await CategoryModel.findById(req.body.category);

	if (!category) {
		return res.status(400).json({
			success: false,
			message: "Invalid category!",
		});
	}

	// obtain the desired parameters from the body of the request
	const {
		name,
		description,
		richDescription,
		image,
		images,
		brand,
		price,
		countInStock,
		rating,
		numReviews,
		isFeatured,
		dateCreated,
	} = req.body;

	// try to update the fields of the desired document and if there is an error, handle it
	try {
		const product = await ProductModel.findByIdAndUpdate(
			req.params.id,
			{
				name,
				description,
				richDescription,
				image,
				images,
				brand,
				price,
				category,
				countInStock,
				rating,
				numReviews,
				isFeatured,
				dateCreated,
			},
			{ new: true }
		);
		// if there was a problem updating the document, handle it
		if (!product) {
			return res.status(400).json({
				success: false,
				message: "Product not found!",
			});
		}
		res.status(200).json({
			success: true,
			product,
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
		const product = await ProductModel.findByIdAndDelete(id);
		if (!product) {
			// this bloack of code runs when the user enters an Id that is valid but doesnot exist in our database
			return res.status(404).json({
				success: false,
				message: "product not found!",
			});
		}
		res.status(200).json({
			success: true,
			message: "Product was deleted!",
		});
	} catch (error) {
		// this block of code runs when a wrong format of the id is used, mongoose has a define id format
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.get("/get/count", async (req, res) => {
	try {
		const productCount = await ProductModel.countDocuments({});

		if (!productCount) {
			return res.status(400).json({
				success: false,
			});
		}

		res.status(200).json({
			success: true,
			productCount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.get("/get/featured", async (req, res) => {
	try {
		const featuredProduct = await ProductModel.find({ isFeatured: true });

		if (!featuredProduct) {
			return res.status(400).json({
				success: false,
				message: "No featured product!",
			});
		}

		res.status(200).json({
			success: true,
			featuredProduct,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

module.exports = router;
