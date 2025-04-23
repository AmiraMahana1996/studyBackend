






//___________________________
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const topicRoutes = require('./routes/topicRoutes.js');
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
});


const flashcardRoutes = require('./routes/flashcards.js');
app.use('/api/flashcards', flashcardRoutes);
// Routes

app.use('/api/study/topics',topicRoutes);

mongoose.connect("mongodb+srv://test:test@cluster0.vzmbp.mongodb.net/")
    .then(() => console.log('MongoDB connection established'))
    .catch(err => console.log('MongoDB connection error:', err));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Listen for events from client
  socket.on('fetchFlashcards', () => {
    // Fetch data from database
    const flashcards = []; // Replace with actual data fetch
    
    // Send data back to the client
    socket.emit('flashcardsData', flashcards);
  });
  
  // Broadcast to all clients when data changes
  socket.on('flashcardUpdated', (data) => {
    io.emit('flashcardChanged', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});