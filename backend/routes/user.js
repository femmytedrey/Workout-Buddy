const express = require("express");
const passport = require("../config/passport");

//controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  checkAuth,
  googleAuthFailure,
  googleAuthSuccess,
  setTokenCookie
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

//Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/user/failure",
  }),
  (req, res, next) => {
    if(!req.user) {
       return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user_data`)
    }
    next();
  },
  googleAuthSuccess
);

router.post('/set-token-cookie', setTokenCookie);

//failed OAuth route
router.get("/failure", googleAuthFailure);

module.exports = router;
