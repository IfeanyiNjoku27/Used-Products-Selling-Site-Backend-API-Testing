const express = require('express');
const router = express.Router();

const Question = require('../models/questionModel');
const { answerQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// 🔹 Ask a question (anonymous allowed)
router.post('/:adId/ask', async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400);
      throw new Error("Question text is required");
    }

    const question = await Question.create({
      text,
      ad: req.params.adId
    });

    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
});

// 🔹 Get all questions for an ad
router.get('/:adId', async (req, res, next) => {
  try {
    const questions = await Question.find({ ad: req.params.adId })
      .sort({ createdAt: -1 });

    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
});

// 🔹 Answer a question (owner only)
router.put('/:questionId/answer', protect, answerQuestion);

module.exports = router;
