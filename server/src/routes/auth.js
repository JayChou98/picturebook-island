import express from 'express';
import { register, login, getMe, updateProfile, uploadAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;