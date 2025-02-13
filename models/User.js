const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please enter a username"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "please anter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "please enter a password"],
      minlength: [8, "the password must be at least 8 characters"],
    },

    profilePic: {
      type: String,
      default: "",
    },
    //create a field called media that consists of an array of objects containing media link and model results
    media: [
      {
        type: Object,
        mediaLink: { type: String },
        modelResults: { type: String },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// mongo hooks are functions after (post) / before (pre) a specific event
module.exports = mongoose.model("User", userSchema);
