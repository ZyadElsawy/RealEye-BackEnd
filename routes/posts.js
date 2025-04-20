const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { validatePostData } = require("../middlewares/validatePost");

// create a new post
router.post("/", validatePostData, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.id;
    const newPost = new Post({
      userID: userId,
      desc: req.body.desc,
    });
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      postID: savePost._id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userID = decoded.id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    if (userID === post.userID.toString()) {
      await post.deleteOne();
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const posts = await Post.find();
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
