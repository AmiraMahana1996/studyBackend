const express = require('express');
const router = express.Router();

// Sample route
router.get('/', (req, res) => {
  res.json({ message: 'Study resources endpoint' });
});

router.get('/topics', (req, res) => {
  // This would typically fetch from a database
  const sampleTopics = [
    { id: 1, name: 'Mathematics', description: 'Numbers and equations' },
    { id: 2, name: 'History', description: 'Past events and their significance' },
    { id: 3, name: 'Computer Science', description: 'Programming and computational theory' }
  ];
  
  res.json(sampleTopics);
});

module.exports = router;