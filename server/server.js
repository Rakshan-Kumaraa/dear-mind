require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const entryRoutes = require('./src/routes/entries');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Connect to MongoDB & Start Server
// Connect to MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI, {
  family: 4 // This forces Node.js to use standard IPv4
})
  .then(() => {
    console.log('connected to the vault (MongoDB)');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error('Database connection failed:', err));