let QuestionModel = require('../models/questionModel');

const answerQuestion = async function (req, res, next) {
  try {
    const { answer } = req.body;

    if (!answer) {
      res.status(400);
      throw new Error('Answer text is required');
    }

    // Find the question and populate its 'ad' field to get owner info
    const question = await QuestionModel.findById(req.params.questionId).populate('ad');

    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    // Check if the logged-in user owns the ad this question belongs to
    if (question.ad.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to answer this question');
    }

    if (question.answer) {
      res.status(400);
      throw new Error('This question has already been answered');
    }

    // Update the answer and timestamp
    question.answer = answer;
    question.answeredAt = Date.now();

    const updatedQuestion = await question.save();

    res.status(200).json({
      success: true,
      message: "Question answered successfully.",
      question: updatedQuestion
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { answerQuestion }