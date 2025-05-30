const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
app.listen(5555, () => console.log(`listening on port 5555....`));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
process.on("SIGINT", () => {
  connection.close(() => {
    console.log("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
});

const handler = require("./middlewares/errorHandler");
const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contact_us");

//const checkToken = require("./middlewares/checkTokens");
// middlewares

app.use(express.json());
//app.use(handler());
app.use(helmet());
app.use(cors());

app.use(cookieParser());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/contact", contactRoute);

// error handling middleware
app.use(handler);
