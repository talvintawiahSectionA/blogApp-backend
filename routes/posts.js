const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newPost = await Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.findAll({ include: "User" });
  res.json(posts);
});

// Like a post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

// Delete a post
router.delete("/:id", async (req, res) => {
  await Post.destroy({ where: { id: req.params.id } });
  res.json({ message: "Post deleted" });
});

module.exports = router;
