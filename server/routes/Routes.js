import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import search from '../controller/search.js';

const router = express.Router();

router.post('/api/login',login);
router.post('/api/signup',signup);
router.post('/api/search',search);

export default router;  