import bcrypt from 'bcryptjs';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByUsername } from '../db/queries.js';

const validateSignUp = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be 100 characters or fewer'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be 100 characters or fewer'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3 to 50 characters')
    .custom(async (value) => {
      const existing = await getUserByUsername(value);
      if (existing) throw new Error('That username is already taken');
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

export function getSignUp(req, res) {
  res.render('sign-up', { errors: [], formData: {} });
}

export const postSignUp = [
  ...validateSignUp,
  async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      // never send the passwords back to the view
      const { password, confirm_password, ...formData } = req.body;
      return res
        .status(400)
        .render('sign-up', { errors: result.array(), formData });
    }

    const { first_name, last_name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      firstName: first_name,
      lastName: last_name,
      username,
      hashedPassword,
    });

    // log them in right after signing up
    req.login(user, (error) => {
      if (error) return next(error);
      res.redirect('/feed');
    });
  },
];

export function getLogIn(req, res) {
  // failed log-ins leave their message in the session
  const messages = req.session.messages || [];
  delete req.session.messages;
  res.render('log-in', { errors: messages.map((msg) => ({ msg })) });
}

export const postLogIn = passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/log-in',
  failureMessage: true,
});

export function logOut(req, res, next) {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect('/');
  });
}
