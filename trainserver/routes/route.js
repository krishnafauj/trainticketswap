import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import getTrainData from '../controller/trainsearch.js';
import { authenticateUser } from '../controller/authentication.js';
import { submitSwapRequest } from '../controller/swaprequest.js';
import { getSwapRequestsByTrainAndDate } from '../controller/getTraindetailsbydateandno.js';
import { getSwapHistoryByUser } from '../controller/getswaprequestbyuser.js';

const router = express.Router();

router.post('/api/login',login);
router.post('/api/signup',signup);
router.use(authenticateUser);
router.get('/api/train',getTrainData); // search box me train find krne ko
router.post('/api/trainswap',submitSwapRequest); // swap krne ki request ko
router.get('/api/trainswap/train', getSwapRequestsByTrainAndDate); // for getting all swpa request for a specific train
router.get('/api/acccounts/swaphistory', getSwapHistoryByUser); // for getting all swap requests of a user
export default router;  