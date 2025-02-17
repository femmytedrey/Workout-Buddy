const express = require("express");

//controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  checkAuth,
} = require("../controllers/userController");

const router = express.Router();

//login routes
router.post("/login", loginUser);

//signup routes
router.post("/signup", signupUser);

//logout route
router.post("/logout", logoutUser);

//check auth route
router.get("/check-auth", checkAuth);

module.exports = router;
