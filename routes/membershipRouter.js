import Router from 'express';
import {
  ensureAuth,
  ensureMember,
  ensureNotMember,
  ensureNotAdmin,
} from '../middleware/auth.js';
import {
  getJoin,
  postJoin,
  getAdmin,
  postAdmin,
} from '../controllers/membershipController.js';
import { passcodeLimiter } from '../middleware/rateLimiters.js';

const membershipRouter = Router();

membershipRouter.get('/join', ensureAuth, ensureNotMember, getJoin);
membershipRouter.post(
  '/join',
  ensureAuth,
  ensureNotMember,
  passcodeLimiter,
  postJoin,
);

membershipRouter.get(
  '/admin',
  ensureAuth,
  ensureMember,
  ensureNotAdmin,
  getAdmin,
);
membershipRouter.post(
  '/admin',
  ensureAuth,
  ensureMember,
  ensureNotAdmin,
  passcodeLimiter,
  postAdmin,
);

export default membershipRouter;
