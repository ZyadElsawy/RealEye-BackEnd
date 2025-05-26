const router = require("express").Router();
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
const { validateCommentData } = require("../middlewares/validateComment");
const Post = require("../models/Post");

// route to add comment to a specific post by a specific user

router.post("/", async (req, res) => {
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
    const newComment = new Comment({
      ...req.body,
      text: req.body.text,
      author: userID,
    });
    const savedComment = await newComment.save();
    res.status(200).json({
      success: "True",
      message: "Comment added successfully",
      commentID: savedComment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

router.get("/:postID", async (req, res) => {
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
    const comments = await Comment.find({ postID: req.params.postID });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    res.status(200).json(comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

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
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    // Check if user is either the comment author or the post owner
    const isCommentAuthor = comment.author.toString() === userID;
    const post = await Post.findById(comment.postID);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Associated post does not exist" });
    }

    const isPostOwner = post.userID.toString() === userID;

    if (isCommentAuthor || isPostOwner) {
      await comment.deleteOne();
      res.status(200).json({
        success: "true",
        message: "Comment deleted successfully",
      });
    } else {
      res.status(403).json({
        success: "false",
        message:
          "You can only delete your own comments or comments on your posts",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.put("/:id", validateCommentData, async (req, res) => {
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
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (comment.author.toString() !== userID) {
      return res.status(403).json({
        success: "false",
        message: "You can only update your own comments :)",
      });
    }
    await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: { text: req.body.text } },
      { new: true }
    );
    res.status(200).json({ success: "true", message: "Updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
