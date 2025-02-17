const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    //to this extent the token is creating:

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    // res.status(201).json({email, user});
    res.status(201).json({ email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No token found' });
  }
  if (token) {
    try {
      const { _id } = jwt.verify(token, process.env.SECRET);
      const user = await User.findOne({ _id });
      res.status(200).json({ email: user.email });
    } catch (error) {
      res.status(401).json({ error: "Invalid token or unauthorized request" });
    }
  } else {
    res.status(401).json({ error: "Authorization is required" });
  }
};

module.exports = {
  loginUser,
  signupUser,
  logoutUser,
  checkAuth,
};
