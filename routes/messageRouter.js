import Router from 'express';
import { ensureAuth } from '../middleware/auth.js';
import { getFeed } from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/feed', ensureAuth, getFeed);

export default messageRouter;
