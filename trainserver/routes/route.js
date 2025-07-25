import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import getTrainData from '../controller/trainsearch.js';
import { authenticateUser } from '../controller/authentication.js';
import { submitSwapRequest } from '../controller/swaprequest.js';
import { getSwapRequestsByTrainAndDate } from '../controller/getTraindetailsbydateandno.js';
import { getSwapHistoryByUser } from '../controller/getswaprequestbyuser.js';

const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.use(authenticateUser);
router.get('/train',getTrainData); 
router.post('/trainswap',submitSwapRequest); // swap krne ki request ko
router.get('/trainswap/train', getSwapRequestsByTrainAndDate); // for getting all swpa request for a specific train
router.get('/acccounts/swaphistory', getSwapHistoryByUser); // for getting all swap requests of a user
export default router;  