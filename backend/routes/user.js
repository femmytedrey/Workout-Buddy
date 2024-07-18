const express = require("express");

//controller functions
const { loginUser, signupUser } = require("../controllers/userController");

const router = express.Router();

//login routes
router.post("/login", loginUser);

//signup routes
router.post("/signup", signupUser);

module.exports = router;
