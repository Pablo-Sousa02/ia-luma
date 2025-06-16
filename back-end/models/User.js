const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    },
    senha: {
    type: String,
    required: true,
    },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

