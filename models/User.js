const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },            // 👈 must match frontend
  email: { type: String, required: true, unique: true },
  password: { type: String},
});

module.exports = mongoose.model('User', userSchema);
