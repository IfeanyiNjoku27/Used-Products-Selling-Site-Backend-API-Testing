import express from 'express';
const router = express.Router();
import {
  createAd,
  getAds,
  getAdById,
  updateAd,
  disableAd,
  askQuestion,
} from '../controllers/adController.js';
import { protect } from '../middleware/authMiddleWare.js';

// Public route to get all active ads
router.route('/').get(getAds);

// Protected route to post a new ad
router.route('/').post(protect, createAd);

// Public route to get a single ad and its Q&A
router.route('/:id').get(getAdById);

// Protected route to edit an owned ad
router.route('/:id').put(protect, updateAd);

// Protected route to disable an owned ad
router.route('/:id/disable').put(protect, disableAd);

// Public route for anonymous users to ask a question
router.route('/:id/questions').post(askQuestion);

export default router;