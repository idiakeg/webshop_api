const { Router } = require("express");
const OrderModel = require("../models/order_model");
const OrderItemsModel = require("../models/OrderItems_model");

const router = Router();

router.get("/", async (req, res) => {
	try {
		const orderList = await OrderModel.find({})
			.populate({
				path: "user",
				select: "name email",
			})
			.sort({ dateCreated: -1 });
		if (!orderList) {
			res.status(501).json({
				success: false,
			});
		} else {
			res.status(200).json(orderList);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		// obtain the id
		const { id } = req.params;
		const order = await OrderModel.findOne({ _id: id }).populate([
			{
				path: "OrderItems",
				populate: { path: "product", populate: "category" },
			},
			{ path: "user", select: "name email" },
		]);
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found!",
			});
		}
		res.status(200).json({
			success: true,
			order,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

router.post("/", async (req, res) => {
	try {
		// obtain the relevant information from the body of the request
		const {
			OrderItems,
			shippingAddress1,
			shippingAddress2,
			city,
			zip,
			country,
			phone,
			status,
			totalPrice,
			user,
		} = req.body;

		// the "OrderItems" should be an array of Ids. To obtain these Ids, u have to first create the OrderItems document in the DB

		// Creating the "OrderItems" document in the DB;
		const newOrderItems = Promise.all(
			OrderItems.map(async ({ quantity, product }) => {
				// obtain data for the OrderItem document
				let individualOrderItem = {
					quantity,
					product,
				};

				const createOrderItems = await OrderItemsModel.create(
					individualOrderItem
				);
				return createOrderItems._id.toString(); //createOrderItems.id
			})
		);

		const orderItemsId = await newOrderItems;

		// create the order
		const order = await OrderModel.create({
			OrderItems: orderItemsId,
			shippingAddress1,
			shippingAddress2,
			city,
			zip,
			country,
			phone,
			status,
			totalPrice,
			user,
		});

		if (!order) {
			res.status(400).json({
				success: false,
				message: "Cannot create order!!",
			});
		}

		res.status(200).json({
			success: true,
			message: "We up!!!",
			data: order,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		// check if order with specified Id exists
		const order = await OrderModel.findById(id);
		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order does not exist!",
			});
		}

		// obtain  the data to be changed
		const { status } = req.body;

		// update the order with the info provided
		const updatedOrder = await OrderModel.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			order: updatedOrder,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error,
		});
	}
});

// create a put route to change the status of the order when it is made. Also make a route to delete an order by Id.

module.exports = router;
