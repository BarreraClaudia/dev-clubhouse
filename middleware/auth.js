// Must be logged in
export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/log-in');
}

// Must NOT be logged in (keeps logged-in users off sign-up and log-in)
export function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/');
}
