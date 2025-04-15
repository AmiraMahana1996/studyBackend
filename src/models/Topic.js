const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Science', 'Mathematics', 'Language', 'History', 'Arts', 'Technology', 'Other']
  },
  icon: {
    type: String,
    default: 'book' // Default icon name
  },
  color: {
    type: String,
    default: '#3498db' // Default color
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    link: {
      type: String
    },
    type: {
      type: String,
      enum: ['Video', 'Article', 'Book', 'Notes', 'Exercise', 'Other'],
      default: 'Other'
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  subtopics: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],
  progress: {
    started: {
      type: Boolean,
      default: false
    },
    percentComplete: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastStudied: {
      type: Date
    }
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Pre-save middleware to update the 'updatedAt' field
topicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Topic', topicSchema);