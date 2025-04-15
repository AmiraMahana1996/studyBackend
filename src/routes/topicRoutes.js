const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Apply auth middleware to all routes


// Topic CRUD routes
router.get('/', topicController.getTopics);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

// Subtopic routes
router.post('/:id/subtopics', topicController.addSubtopic);

// Resource routes
router.post('/:id/resources', topicController.addResource);

// Progress routes
router.post('/:id/progress', topicController.updateProgress);

module.exports = router;

// backend/src/middleware/auth.js
// Simple authentication middleware
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports = (req, res, next) => {
//   try {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return res.status(401).json({ message: 'No authentication token, access denied' });
//     }
    
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = verified;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token verification failed, authorization denied' });
//   }
// };