require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const app = express();

const corsOptions = {
	origin: "*",
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => {
	console.log("Now connected to MongoDB Atlas.");
});

if (require.main === module) {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	});
}

module.exports = { app, mongoose };
