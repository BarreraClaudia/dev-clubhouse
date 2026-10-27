import Router from 'express';
import { ensureAuth } from '../middleware/auth.js';
import { getFeed, postMessage } from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/feed', ensureAuth, getFeed);
messageRouter.post('/messages', ensureAuth, postMessage);

export default messageRouter;
