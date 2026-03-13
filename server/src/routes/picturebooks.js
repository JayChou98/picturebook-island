import express from 'express';
import {
  getAllPictureBooks,
  getPictureBookById,
  createPictureBook,
  updatePictureBook,
  deletePictureBook,
  incrementViews
} from '../controllers/picturebookController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.route('/')
  .get(getAllPictureBooks)
  .post(protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pages', maxCount: 50 }]), createPictureBook);

router.route('/:id')
  .get(optionalAuth, getPictureBookById)
  .put(protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'pages', maxCount: 50 }]), updatePictureBook)
  .delete(protect, deletePictureBook);

router.put('/:id/views', incrementViews);

export default router;