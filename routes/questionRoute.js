import express from 'express';
const router = express.Router();
import { answerQuestion } from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleWare.js';

// Protected route for an ad owner to answer a question
router.route('/:questionId/answer').put(protect, answerQuestion);

export default router;