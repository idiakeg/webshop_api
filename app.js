// npm modules
const express = require("express");
const app = express();
const { json } = express;
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// env variables
const port = process.env.PORT;
const api_root = process.env.API_ROOT;
const uri = process.env.URI;

// local modules
const connect = require("./db_connect");
const authJwt = require("./helpers/jwt");
const errHandler = require("./helpers/errorHandler");

// Routers
const productRouter = require("./routers/product_router");
const categoryRouter = require("./routers/category_router");
const orderRouter = require("./routers/order_router");
const userRouter = require("./routers/user_router");

// Home route
app.get("/", (req, res) => {
	res.send("Welcome to the shit storm");
});
app.get(`${api_root}`, (req, res) => {
	res.send("Welcome to the API");
});

// middleware
app.use(json());
app.use(morgan("combined"));
app.use(authJwt());
app.use(errHandler);
// --> CORS accessbility middleware
app.use(cors());
app.options("*", cors());

// --Router middlewares
app.use(`${api_root}/products`, productRouter);
app.use(`${api_root}/categories`, categoryRouter);
app.use(`${api_root}/orders`, orderRouter);
app.use(`${api_root}/users`, userRouter);

const start = async () => {
	try {
		await connect(uri);
		console.log("successfully connected to the DB");
		// listen to the server
		app.listen(port, () => console.log(`app is listening on port: ${port}`));
	} catch (error) {
		console.log("Something went wrong:", error);
	}
};

// call the start function to connect to the DB and listen for the server
start();
