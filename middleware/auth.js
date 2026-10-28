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

/*
---------------------
For secret passcodes
---------------------
*/

// Members only; recruits are sent to the join page
export function ensureMember(req, res, next) {
  if (req.user.is_member) return next();
  res.redirect('/join');
}

// Already a member, so there's nothing to join
export function ensureNotMember(req, res, next) {
  if (!req.user.is_member) return next();
  res.redirect('/feed');
}

// Already an admin, so there's nothing to elevate
export function ensureNotAdmin(req, res, next) {
  if (!req.user.is_admin) return next();
  res.redirect('/feed');
}

/*
----------------------
For deleting messages
----------------------
*/

// Admins only
export function ensureAdmin(req, res, next) {
  if (req.user.is_admin) return next();
  res.status(403).send('Forbidden');
}
