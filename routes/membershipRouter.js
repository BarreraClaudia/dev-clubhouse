import Router from 'express';
import { ensureAuth, ensureNotMember } from '../middleware/auth.js';
import { getJoin, postJoin } from '../controllers/membershipController.js';

const membershipRouter = Router();

membershipRouter.get('/join', ensureAuth, ensureNotMember, getJoin);
membershipRouter.post('/join', ensureAuth, ensureNotMember, postJoin);

export default membershipRouter;
