const express = require("express");
const router = express.Router();

const {
  askQuestion,
  getQuestionsForAd,
  answerQuestion,
} = require("../controllers/questionController");

const { protect } = require("../middleware/authMiddleware");

// Anonymous users can ask questions
router.post("/:adId/ask", askQuestion);

// Anyone can VIEW questions
router.get("/:adId", getQuestionsForAd);

// Only ad owner can answer
router.put("/:questionId/answer", protect, answerQuestion);

module.exports = router;
