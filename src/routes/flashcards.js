// const express = require('express');
// const router = express.Router();

// const flashcardController = require('../controllers/flashcardController');

// // Create a new flashcard
// router.post('/', flashcardController.createFlashcard);

// // Get all flashcards for a topic
// router.get('/topic/:topicId', flashcardController.getFlashcardsByTopic);

// // Get a single flashcard
// router.get('/:id',  flashcardController.getFlashcardById);

// // Update a flashcard
// router.patch('/:id',  flashcardController.updateFlashcard);

// // Delete a flashcard
// router.delete('/:id',  flashcardController.deleteFlashcard);

// // Get flashcards due for review
// router.get('/review/due',  flashcardController.getFlashcardsForReview);

// // Update flashcard after review
// router.patch('/:id/review', flashcardController.updateFlashcardReview);

// module.exports = router;
// ----------------------------------

// routes/flashcardRoutes.js
const express = require('express');
const multer = require('multer');
const flashcardController = require('../controllers/flashcardController');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Protect all routes after this middleware


router.route('/study')
  .get(flashcardController.getFlashcardsForStudy);

router.route('/stats')
  .get(flashcardController.getFlashcardStats);

router.route('/')
  .get(flashcardController.getAllFlashcards)
  .post(flashcardController.createFlashcard);

router.route('/:id')
  .get(flashcardController.getFlashcard)
  .patch(flashcardController.updateFlashcard)
  .delete(flashcardController.deleteFlashcard);

router.route('/:id/response')
  .post(flashcardController.recordResponse);


  router.post(
    '/import-excel',
    upload.single('excelFile'), // 'excelFile' is the field name for the uploaded file
    flashcardController.importFlashcardsFromExcel
  );
module.exports = router;