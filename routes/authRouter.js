import Router from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth.js';
import {
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  logOut,
} from '../controllers/authController.js';
import { loginLimiter, signupLimiter } from '../middleware/rateLimiters.js';

const authRouter = Router();

authRouter.get('/sign-up', ensureGuest, getSignUp);
authRouter.post('/sign-up', ensureGuest, signupLimiter, postSignUp);

authRouter.get('/log-in', ensureGuest, getLogIn);
authRouter.post('/log-in', ensureGuest, loginLimiter, postLogIn);

authRouter.get('/log-out', ensureAuth, logOut);

export default authRouter;
