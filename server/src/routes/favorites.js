import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite
} from '../controllers/favoriteController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, addFavorite)
  .get(protect, getFavorites);

router.delete('/:picturebookId', protect, removeFavorite);
router.get('/check/:picturebookId', optionalAuth, checkFavorite);

export default router;