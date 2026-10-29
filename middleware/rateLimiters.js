import { rateLimit } from 'express-rate-limit';

function tooMany(message) {
  return (req, res) => {
    // the terminal script sends Accept: application/json
    if (req.accepts(['html', 'json']) === 'json') {
      return res.status(429).json({ ok: false, message });
    }
    res.status(429).render('error', {
      status: 429,
      heading: 'TOO MANY ATTEMPTS',
      message,
    });
  };
}

// Log-in attempts, successful or not (a failed log-in is a redirect, so it can't be filtered by status)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany('Too many log-in attempts. Try again in 15 minutes.'),
});

// New accounts per IP
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany(
    'Too many accounts created from this connection. Try again later.',
  ),
});

// Passcode guesses. Only failures (401) count; a correct passcode is skipped.
export const passcodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany('Too many failed attempts. Locked out for 15 minutes.'),
});
