const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  promptUsed: { type: String },
  date: { type: Date, default: Date.now },
  
  // Time Capsule Features
  isTimeCapsule: { type: Boolean, default: false },
  unlockDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);