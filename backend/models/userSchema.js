const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

//static signup method
userSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is too weak");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Email not found");
  }

  if (user.authProvider === "google" && !user.password) {
    throw new Error(
      "This account uses Google login. Please sign in with Google."
    );
  }

  if (!user.password) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid email or password");
  }

  return user;
};

userSchema.statics.findOrCreateGoogleUser = async function (profile) {
  try {
    // Check if user exists by Google ID
    let user = await this.findOne({ googleId: profile.id });
    if (user) {
      return user;
    }

    // Safe email extraction
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error("No email provided by Google");
    }

    user = await this.findOne({ email });
    if (user) {
      // Link existing account to Google
      user.googleId = profile.id;
      user.authProvider = "google";
      if (profile.displayName) user.name = profile.displayName;
      if (profile.photos?.[0]?.value)
        user.profilePicture = profile.photos[0].value;

      await user.save();
      return user;
    }

    const userData = {
      email,
      googleId: profile.id,
      authProvider: "google",
    };

    if (profile.displayName) userData.name = profile.displayName;
    if (profile.photos?.[0]?.value)
      userData.profilePicture = profile.photos[0].value;

    user = await this.create(userData);
    return user;
  } catch (error) {
    console.error("Google user creation error:", error);
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
