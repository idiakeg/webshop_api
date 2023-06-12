const { Router } = require("express");
const OrderModel = require("../models/order_model");

const router = Router();

router.get("/", async (req, res) => {
	const orderList = await OrderModel.find({});
	if (!orderList) {
		res.status(501).json({
			success: false,
		});
	} else {
		res.status(200).json(orderList);
	}
});

module.exports = router;
