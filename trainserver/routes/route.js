import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import getTrainData from '../controller/trainsearch.js';
import { authenticateUser } from '../controller/authentication.js';
import { submitSwapRequest } from '../controller/swapController.js';
import { getSwapRequestsByTrainAndDate } from '../controller/getTraindetailsbydateandno.js';
const router = express.Router();

router.post('/api/login',login);
router.post('/api/signup',signup);
router.use(authenticateUser);
router.get('/api/train',getTrainData);
router.post('/api/trainswap',submitSwapRequest);
router.get('/trainswap/train', getSwapRequestsByTrainAndDate);



export default router;  