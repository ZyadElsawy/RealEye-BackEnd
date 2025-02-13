const mongoose = require("mongoose");
const { isEmail } = require("validator");
const contactSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "please enter a username"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "please anter an email"],
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
    message: {
      type: String,
      required: [true, "please enter a message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contacts", contactSchema);
