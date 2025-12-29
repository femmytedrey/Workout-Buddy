const app = require("./app");
const mongoose = require("mongoose");

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
