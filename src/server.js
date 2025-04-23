const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const topicRoutes = require('./routes/topicRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
const flashcardRoutes = require('./routes/flashcards.js');
app.use('/api/flashcards', flashcardRoutes);
// Routes

app.use('/api/study/topics',topicRoutes);
app.get('/api',(res,req)=>{
    req.send("Hello")
});
// Sample route import
// const studyRoutes = require('./routes/studyRoutes');
// app.use('/api/study', studyRoutes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://test:test@cluster0.vzmbp.mongodb.net/")
    .then(() => console.log('MongoDB connection established'))
    .catch(err => console.log('MongoDB connection error:', err));

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});