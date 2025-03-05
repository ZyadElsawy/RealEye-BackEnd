const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//

router.get("/user", async (req, res) => {
  try {
    // Get token from Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Extract token from Bearer Token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid JWT token" });
      }
      throw err; // If other errors happen
    }

    const userID = decoded.id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
