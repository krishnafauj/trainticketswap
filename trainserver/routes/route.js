import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import getTrainData from '../controller/trainsearch.js';
const router = express.Router();

router.post('/api/login',login);
router.post('/api/signup',signup);
router.get('/api/train',getTrainData);


export default router;  