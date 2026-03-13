import express from 'express';
import { getCategoriesByType, createCategory, getAllCategories } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:type', getCategoriesByType);
router.post('/', protect, createCategory);

export default router;