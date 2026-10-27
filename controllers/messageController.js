import { body, validationResult } from 'express-validator';
import { getAllMessages, createMessage } from '../db/queries.js';

// "2026-10-25 21:14 UTC"
const formatTime = (date) =>
  date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';

async function loadFeed(user) {
  const rows = await getAllMessages();

  return rows.map((row) => {
    const message = {
      id: row.id,
      ref: '#' + String(row.id).padStart(3, '0'),
      title: row.title,
      text: row.text,
    };

    // Only members and admins get author details.
    // For everyone else these fields never leave the server, so they can't be found in the page source.
    if (user.is_member) {
      message.handle = row.username;
      message.name = `${row.first_name} ${row.last_name}`;
      message.time = formatTime(row.created_at);
      message.iso = row.created_at.toISOString();
    }

    return message;
  });
}

export async function getFeed(req, res) {
  const messages = await loadFeed(req.user);
  res.render('feed', { messages, errors: [], formData: {} });
}

const validateMessage = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be 255 characters or fewer'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message must be 2000 characters or fewer'),
];

export const postMessage = [
  ...validateMessage,
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const messages = await loadFeed(req.user);
      return res.status(400).render('feed', {
        messages,
        errors: result.array(),
        formData: req.body,
      });
    }

    await createMessage({
      title: req.body.title,
      text: req.body.text,
      userId: req.user.id,
    });

    res.redirect('/feed');
  },
];
