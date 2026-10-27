import Router from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth.js';
import {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  logOut,
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.get('/sign-up', ensureGuest, getSignUp);
authRouter.post('/sign-up', ensureGuest, postSignUp);

authRouter.get('/log-in', ensureGuest, getLogIn);
authRouter.post('/log-in', ensureGuest, postLogIn);

authRouter.get('/log-out', ensureAuth, logOut);

export default authRouter;
