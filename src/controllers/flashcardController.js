// const Flashcard = require('../models/flashcard');
// const mongoose = require('mongoose');
// /**
//  * Create a new flashcard
//  */
// exports.createFlashcard = async (req, res) => {
//   try {
//     const { question, answer, topicId, difficulty, tags } = req.body;
//     console.log(typeof topicId)
//     let topicid = new mongoose.Types.ObjectId(topicId);
//     const flashcard = new Flashcard({
//       question,
//       answer,
//       topicId,
//       difficulty,
//       tags,
//       createdBy: req.body.createdBy
//     });
    
//     await flashcard.save();
//     res.status(201).json(flashcard);
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ message: error.message });
//   }
// };

// /**
//  * Get all flashcards for a topic
//  */
// exports.getFlashcardsByTopic = async (req, res) => {
//   try {
//     const { topicId } = req.params;
    
//     const flashcards = await Flashcard.find({ 
//       topicId, 

//     }).sort({ createdAt: -1 });
    
//     res.status(200).json(flashcards);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Get a single flashcard by ID
//  */
// exports.getFlashcardById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const flashcard = await Flashcard.findOne({ 
//       _id: id, 
//       createdBy: req.body.createdBy
//     });
    
//     if (!flashcard) {
//       return res.status(404).json({ message: 'Flashcard not found' });
//     }
    
//     res.status(200).json(flashcard);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update a flashcard
//  */
// exports.updateFlashcard = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     const flashcard = await Flashcard.findOneAndUpdate(
//       { _id: id, createdBy:req.body.createdBy},
//       updates,
//       { new: true, runValidators: true }
//     );
    
//     if (!flashcard) {
//       return res.status(404).json({ message: 'Flashcard not found' });
//     }
    
//     res.status(200).json(flashcard);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// /**
//  * Delete a flashcard
//  */
// exports.deleteFlashcard = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const flashcard = await Flashcard.findOneAndDelete({ 
//       _id: id, 
//       createdBy: req.body.createdBy
//     });
    
//     if (!flashcard) {
//       return res.status(404).json({ message: 'Flashcard not found' });
//     }
    
//     res.status(200).json({ message: 'Flashcard deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Get flashcards due for review
//  */
// exports.getFlashcardsForReview = async (req, res) => {
//   try {
//     const now = new Date();
    
//     const flashcards = await Flashcard.find({ 
//       createdBy: req.body.createdBy,
//       nextReviewDate: { $lte: now }
//     }).limit(20).sort({ nextReviewDate: 1 });
    
//     res.status(200).json(flashcards);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// /**
//  * Update flashcard after review (using spaced repetition)
//  */
// exports.updateFlashcardReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { confidence } = req.body;
    
//     // Confidence levels 0-5 (0: Failed, 5: Perfect)
//     const confidenceLevel = parseInt(confidence);
    
//     // Basic spaced repetition algorithm
//     let daysToAdd = 1;
//     if (confidenceLevel === 5) daysToAdd = 30;
//     else if (confidenceLevel === 4) daysToAdd = 14;
//     else if (confidenceLevel === 3) daysToAdd = 7;
//     else if (confidenceLevel === 2) daysToAdd = 3;
//     else if (confidenceLevel === 1) daysToAdd = 1;
//     else daysToAdd = 0; // Review again today
    
//     const nextReviewDate = new Date();
//     nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
    
//     const flashcard = await Flashcard.findOneAndUpdate(
//       { _id: id, createdBy: req.user._id },
//       { 
//         confidence: confidenceLevel,
//         lastReviewed: new Date(),
//         nextReviewDate,
//         $inc: { reviewCount: 1 }
//       },
//       { new: true }
//     );
    
//     if (!flashcard) {
//       return res.status(404).json({ message: 'Flashcard not found' });
//     }
    
//     res.status(200).json(flashcard);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// __________________________________

// controllers/flashcardController.js
const Flashcard = require('../models/flashcardModel');

// Get all flashcards
exports.getAllFlashcards = async (req, res, next) => {
  const flashcards = await Flashcard.find()
    .populate('topic', 'name')
    .sort('-createdAt');
  console.log(flashcards);
  res.status(200).json(flashcards);
};

// Get flashcards for study (without user context)
exports.getFlashcardsForStudy = async (req, res, next) => {
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  let query = {
    $or: [
      { lastReviewed: { $lt: fiveMinutesAgo } },
      { lastReviewed: null },
    ],
  };

  if (req.query.topic) {
    query.topic = req.query.topic;
  }

  const flashcards = await Flashcard.find(query)
    .populate('topic', 'name')
    .limit(20)
    .sort({ lastReviewed: 1, reviewCount: 1 });

  res.status(200).json(flashcards);
};

// Get a single flashcard
exports.getFlashcard = async (req, res, next) => {
  const flashcard = await Flashcard.findOne({ _id: req.params.id }).populate(
    'topic',
    'name'
  );

  if (!flashcard) {
    return 'No flashcard found with that ID';
  }

  res.status(200).json(flashcard);
};

// Create a new flashcard
exports.createFlashcard = async (req, res, next) => {
  const newFlashcard = await Flashcard.create(req.body);
  res.status(201).json(newFlashcard);
};

// Update a flashcard
exports.updateFlashcard = async (req, res, next) => {
  const flashcard = await Flashcard.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!flashcard) {
    return 'No flashcard found with that ID';
  }

  res.status(200).json(flashcard);
};

// Delete a flashcard
exports.deleteFlashcard = async (req, res, next) => {
  const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id });

  if (!flashcard) {
    return 'No flashcard found with that ID';
  }

  res.status(204).json(null);
};

// Record flashcard response (correct/incorrect)
exports.recordResponse = async (req, res, next) => {
  const { isCorrect } = req.body;

  if (typeof isCorrect !== 'boolean') {
    return 'isCorrect must be a boolean value';
  }

  const flashcard = await Flashcard.findOne({ _id: req.params.id });

  if (!flashcard) {
    return next(new Error('No flashcard found with that ID'));
  }

  flashcard.lastReviewed = new Date();
  flashcard.reviewCount += 1;

  if (isCorrect) {
    flashcard.correctCount += 1;

    if (
      flashcard.correctCount > flashcard.incorrectCount + 3 &&
      flashcard.difficulty !== 'easy'
    ) {
      if (flashcard.difficulty === 'hard') {
        flashcard.difficulty = 'medium';
      } else if (flashcard.difficulty === 'medium') {
        flashcard.difficulty = 'easy';
      }
    }
  } else {
    flashcard.incorrectCount += 1;

    if (
      flashcard.incorrectCount > flashcard.correctCount &&
      flashcard.difficulty !== 'hard'
    ) {
      if (flashcard.difficulty === 'easy') {
        flashcard.difficulty = 'medium';
      } else if (flashcard.difficulty === 'medium') {
        flashcard.difficulty = 'hard';
      }
    }
  }

  await flashcard.save();

  res.status(200).json({
    status: 'success',
    data: flashcard,
  });
};

// Get flashcard statistics (without user context)
exports.getFlashcardStats = async (req, res, next) => {
  const stats = await Flashcard.aggregate([
    {
      $group: {
        _id: null,
        totalCards: { $sum: 1 },
        reviewedCards: { $sum: { $cond: [{ $ne: ['$lastReviewed', null] }, 1, 0] } },
        totalReviews: { $sum: '$reviewCount' },
        correctAnswers: { $sum: '$correctCount' },
        incorrectAnswers: { $sum: '$incorrectCount' },
        avgCorrectRate: {
          $avg: {
            $cond: [
              { $gt: ['$reviewCount', 0] },
              {
                $divide: [
                  '$correctCount',
                  { $add: ['$correctCount', '$incorrectCount'] },
                ],
              },
              0,
            ],
          },
        },
      },
    },
  ]);

  const difficultyStats = await Flashcard.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
      },
    },
  ]);

  const topicStats = await Flashcard.aggregate([
    {
      $group: {
        _id: '$topic',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'topics',
        localField: '_id',
        foreignField: '_id',
        as: 'topicData',
      },
    },
    {
      $project: {
        count: 1,
        topicName: { $arrayElemAt: ['$topicData.name', 0] },
      },
    },
  ]);

  res.status(200).json({
    stats: stats.length > 0 ? stats[0] : {
      totalCards: 0,
      reviewedCards: 0,
      totalReviews: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      avgCorrectRate: 0,
    },
    difficultyStats,
    topicStats,
  });
};