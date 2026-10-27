import { createHash, timingSafeEqual } from 'node:crypto';
import { setMember } from '../db/queries.js';

const digest = (value) =>
  createHash('sha256')
    .update(String(value ?? ''))
    .digest();

// Constant-time comparison. Hashing first makes both buffers the same length,
// which timingSafeEqual requires.
function passcodeMatches(input, secret) {
  if (!secret) return false; // a missing env var must never unlock anything
  return timingSafeEqual(digest(input), digest(secret));
}

// JSON for the terminal script, redirect/re-render for plain form posts
function finish(req, res, ok, config, successUrl) {
  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(ok ? 200 : 401).json({ ok });
  }
  if (ok) return res.redirect(successUrl);
  res
    .status(401)
    .render('terminal', { ...config, error: config.deniedMessage });
}

const joinTerminal = {
  mode: 'join',
  accent: 'green',
  windowTitle: 'recruit@dev_clubhouse: ~/join',
  banner: 'DEV_CLUBHOUSE SECURE SHELL v1.0',
  infoLines: [
    'clearance ........ RECRUIT',
    'restricted ....... author, timestamp',
  ],
  intro: 'Enter the secret key to request MEMBER clearance.',
  prompt: 'recruit@dev_clubhouse:~$ ./join --key',
  placeholder: 'enter secret key',
  inputLabel: 'Secret key',
  action: '/join',
  successUrl: '/feed',
  enterLabel: '> ENTER DEV_CLUBHOUSE',
  deniedMessage: 'ACCESS DENIED. Invalid key.',
  error: null,
};

export function getJoin(req, res) {
  res.render('terminal', joinTerminal);
}

export async function postJoin(req, res) {
  const ok = passcodeMatches(req.body.passcode, process.env.MEMBER_PASSCODE);
  if (ok) await setMember(req.user.id);
  finish(req, res, ok, joinTerminal, '/feed');
}
