import express from 'express';
import { google, signin, signup, verifyemail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/verifyemail', verifyemail);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

export default router;