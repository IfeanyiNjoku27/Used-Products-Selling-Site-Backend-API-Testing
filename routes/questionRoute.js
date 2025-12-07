const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");
const Question = require("../models/questionModel");
const  answerQuestion  = require("../models/questionModel.js");

// CREATE A NEW QUESTION (Anonymous allowed)
router.post("/", async (req, res) => {
  try {
    const { text, ad } = req.body;

    if (!text || !ad) {
      return res.status(400).json({ message: "Text and ad ID required" });
    }

    const question = await Question.create({ text, ad });
    res.status(201).json(question);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error creating question" });
  }
});

// GET ALL QUESTIONS FOR A SPECIFIC AD
router.get("/ad/:adId", async (req, res) => {
  try {
    const questions = await Question.find({ ad: req.params.adId });

    res.json(questions);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Ad owner to answer a question
router.put("/:questionId/answer", protect, answerQuestion);

module.exports = router;
