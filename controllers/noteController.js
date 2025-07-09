const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
};

// POST /api/notes
exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true } // return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELETE /api/notes/:id
// DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

