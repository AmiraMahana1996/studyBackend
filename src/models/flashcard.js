const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  lastReviewed: {
    type: Date
  },
  nextReviewDate: {
    type: Date
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  confidence: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

}, {
  timestamps: true
});

// Index for efficient topic-based querying
flashcardSchema.index({ topicId: 1 });

// Index for efficient review querying
flashcardSchema.index({ nextReviewDate: 1, createdBy: 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
