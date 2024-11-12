const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import routes
const userRoutes = require('./routes/users');
const healthInfoRoutes = require('./routes/healthInfo');
const symptomRoutes = require('./routes/symptoms');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/health-info', healthInfoRoutes);
app.use('/api/symptoms', symptomRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Health Info API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});