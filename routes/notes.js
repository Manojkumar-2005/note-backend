const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ GET notes for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newNote = new Note({
      title,
      content,
      userId: req.user.id,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  console.log("🔥 DELETE request for note:", noteId);
  console.log("🔐 Authenticated user ID:", userId);

  try {
    const note = await Note.findOne({ _id: noteId });
    console.log("📄 Found note:", note);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized: Not your note" });
    }

    await Note.deleteOne({ _id: noteId });
    console.log("✅ Note deleted successfully");
    res.json({ message: "Note deleted", id: noteId });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
