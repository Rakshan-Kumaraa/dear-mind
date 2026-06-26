const express = require('express');
const Entry = require('../models/Entry');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// Get all entries for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user.id }).sort({ date: -1 });
    
    // Time Capsule Logic: Hide content if it's not time yet
    const processedEntries = entries.map(entry => {
      if (entry.isTimeCapsule && entry.unlockDate > new Date()) {
        return {
          _id: entry._id,
          date: entry.date,
          isTimeCapsule: true,
          unlockDate: entry.unlockDate,
          content: "🔒 This memory is sealed until " + entry.unlockDate.toDateString()
        };
      }
      return entry; // Safe to send full entry
    });

    res.json(processedEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

// Save a new entry
router.post('/', requireAuth, async (req, res) => {
  try {
    const newEntry = new Entry({
      ...req.body,
      userId: req.user.id
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ error: 'Failed to save entry.' });
  }
});

module.exports = router;