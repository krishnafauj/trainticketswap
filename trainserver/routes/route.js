import express from 'express';
import login from '../controller/login.js';
import signup from '../controller/signup.js';
import getTrainData from '../controller/trainsearch.js';
import { authenticateUser } from '../controller/authentication.js';
import { submitSwapRequest } from '../controller/swaprequest.js';
import { getSwapRequestsByTrainAndDate } from '../controller/getTraindetailsbydateandno.js';
import { getSwapHistoryByUser } from '../controller/getswaprequestbyuser.js';
import addFriend from '../controller/addfriend.js';
import {  getFriends } from '../controller/getFriends.js';
import {findFriendship} from '../controller/findFriendSchemaid.js'
import message_get from '../controller/message.js';
const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// All routes below require authentication
router.use(authenticateUser);

// Train and Swap routes
router.get('/train', getTrainData);
router.post('/trainswap', submitSwapRequest);
router.get('/trainswap/train', getSwapRequestsByTrainAndDate);
router.get('/acccounts/swaphistory', getSwapHistoryByUser);

// Friend-related routes

router.get('/friends/get', getFriends);    // ✅ added for retrieving friendshipId
router.post('/friends/add', addFriend);          // ✅ corrected to RESTful path
router.post('/friends/find', findFriendship);
router.get('/messages/:friendshipId',message_get);

export default router;
