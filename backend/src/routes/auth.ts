import express from 'express';
import { register, login, checkEmail, deleteUser, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-email', checkEmail);
router.delete('/user/:email', deleteUser);
router.get('/me', protect, getMe);

export default router;
