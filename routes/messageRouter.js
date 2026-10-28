import Router from 'express';
import { ensureAuth, ensureAdmin } from '../middleware/auth.js';
import {
  getFeed,
  postMessage,
  postDeleteMessage,
} from '../controllers/messageController.js';

const messageRouter = Router();

messageRouter.get('/feed', ensureAuth, getFeed);
messageRouter.post('/messages', ensureAuth, postMessage);
messageRouter.post(
  '/messages/:id/delete',
  ensureAuth,
  ensureAdmin,
  postDeleteMessage,
);

export default messageRouter;
