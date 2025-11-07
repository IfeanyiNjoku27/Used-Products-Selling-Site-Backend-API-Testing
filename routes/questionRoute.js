const express = require('express');
const router = express.Router();
const { answerQuestion } = require('../controllers/questionController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Protected route for an ad owner to answer a question
router.route('/:questionId/answer').put(protect, answerQuestion);

module.exports = router;