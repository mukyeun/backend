const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Import routes
const userRoutes = require('./routes/users');
const healthInfoRoutes = require('./routes/healthInfo');
const symptomRoutes = require('./routes/symptoms');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('MongoDB connected successfully'))
    .catch((err) => logger.error('MongoDB connection error:', err));
}

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Health Info API Documentation"
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/health-info', healthInfoRoutes);
app.use('/api/symptoms', symptomRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Health Info API',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;  // Export app for testing