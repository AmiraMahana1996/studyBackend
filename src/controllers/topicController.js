const Topic = require('../models/Topic');

// Get all topics for a user
exports.getTopics = async (req, res) => {
  try {
// Assuming authentication middleware sets req.user
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
};

// Get a single topic by ID
exports.getTopicById = async (req, res) => {

  try {
    const topic = await Topic.findOne({ 
      _id: req.params.id,
    
    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
};

// Create a new topic
exports.createTopic = async (req, res) => {
  try {
    const { name, description, category, icon, color } = req.body;
    // Check if topic name already exists for this user

    const existingTopic = await Topic.findOne({ 
      name: name,
    });
    
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic with this name already exists' });
    }

    const newTopic = new Topic({
      name,
      description,
      category: category || 'Other',
      icon: icon || 'book',
      color: color || '#3498db',
      
    });
    
    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Error creating topic', error: error.message });
  }
};

// Update a topic
exports.updateTopic = async (req, res) => {
  try {
    const { name, description, category, icon, color } = req.body;
    
    // Check if the topic exists and belongs to the user
    const topic = await Topic.findOne({
      _id: req.params.id,
   
    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // If name is being changed, check for duplicates
    if (name !== topic.name) {
      const existingTopic = await Topic.findOne({ 
        name: name,
    
        _id: { $ne: req.params.id } // Exclude the current topic
      });
      
      if (existingTopic) {
        return res.status(400).json({ message: 'Topic with this name already exists' });
      }
    }
    
    // Update the topic
    topic.name = name || topic.name;
    topic.description = description || topic.description;
    topic.category = category || topic.category;
    topic.icon = icon || topic.icon;
    topic.color = color || topic.color;
    
    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Error updating topic', error: error.message });
  }
};

// Delete a topic
exports.deleteTopic = async (req, res) => {
  try {
    const result = await Topic.deleteOne({
      _id: req.params.id,
     
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting topic', error: error.message });
  }
};

// Add a subtopic to a topic
exports.addSubtopic = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Subtopic name is required' });
    }
    
    const topic = await Topic.findOne({
      _id: req.params.id,
     
    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Check if subtopic with this name already exists
    const subtopicExists = topic.subtopics.some(subtopic => subtopic.name === name);
    if (subtopicExists) {
      return res.status(400).json({ message: 'Subtopic with this name already exists' });
    }
    
    topic.subtopics.push({ name, description });
    const updatedTopic = await topic.save();
    
    res.json(updatedTopic.subtopics);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subtopic', error: error.message });
  }
};

// Add a resource to a topic
exports.addResource = async (req, res) => {
  try {
    const { title, description, link, type } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Resource title is required' });
    }
    
    const topic = await Topic.findOne({
      _id: req.params.id,

    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    topic.resources.push({
      title,
      description,
      link,
      type: type || 'Other',
      dateAdded: new Date()
    });
    
    const updatedTopic = await topic.save();
    res.json(updatedTopic.resources);
  } catch (error) {
    res.status(500).json({ message: 'Error adding resource', error: error.message });
  }
};

// Update topic progress
exports.updateProgress = async (req, res) => {
  try {
    const { percentComplete } = req.body;
    
    if (percentComplete === undefined || percentComplete < 0 || percentComplete > 100) {
      return res.status(400).json({ message: 'Valid progress percentage (0-100) is required' });
    }
    
    const topic = await Topic.findOne({
      _id: req.params.id,
   
    });
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    topic.progress.started = true;
    topic.progress.percentComplete = percentComplete;
    topic.progress.lastStudied = new Date();
    
    const updatedTopic = await topic.save();
    res.json(updatedTopic.progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};