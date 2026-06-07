require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Global Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded payloads

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Manager API' });
});

// Error Handling Middleware: Route Not Found
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error Handling Middleware: Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
