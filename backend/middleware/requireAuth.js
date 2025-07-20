const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authorization is required" });
  }

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    //console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ error: "Token has expired, please log in again" });
    }
    res.status(401).json({ error: "Invalid token or unauthorized request" });
  }
};

module.exports = requireAuth;
