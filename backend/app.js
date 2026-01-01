const express = require("express");
const dotenv = require("dotenv");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user.js");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//config
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

//express app
const app = express();

//cors

//middleware
app.use(express.json());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use((req, res, next) => {
  // console.log(req.path, req.method);
  next();
});

//routes
app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the application" });
});
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = app;
