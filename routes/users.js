const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/user", async (req, res) => {
  //console.log("in");
  try {
    const token = req.cookies.jwt;
    //console.log(token);
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    const userID = decoded.id;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // console.log(user);
    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
