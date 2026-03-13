import express from 'express';
import { getDailyRecommendations, getPersonalizedRecommendations } from '../controllers/recommendationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', optionalAuth, getDailyRecommendations);
router.get('/personalized', protect, getPersonalizedRecommendations);

export default router;