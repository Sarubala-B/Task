const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/signup');
const todoRoutes = require('./routes/todo');
const loginRoutes = require('./routes/login');
const app = express();

// Middleware for CORS
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'userid'],
}));


// Middleware for parsing JSON
app.use(express.json());

// Define the routes
app.use('/api', userRoutes);
app.use('/api', todoRoutes);
app.use('/api', loginRoutes);

// Set up the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
