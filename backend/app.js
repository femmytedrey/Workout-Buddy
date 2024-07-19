const express = require("express");
const dotenv = require("dotenv");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user.js");
const mongoose = require("mongoose");
const cors = require("cors");

//config
dotenv.config();

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
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

//db connection
const port = process.env.PORT;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    //listening to requests
    app.listen(port, () => {
      console.log("Database connected successfully listening on port", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
