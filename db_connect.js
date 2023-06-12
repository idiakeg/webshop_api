const mongoose = require("mongoose");

// Define the connect function that is called with th uri of the database and runs the mongoose connect method.
const connect = async (uri) => {
	await mongoose.connect(uri);
};

module.exports = connect;
