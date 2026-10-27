import { getAllMessages } from '../db/queries.js';

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
    }

    return message;
  });
}

export async function getFeed(req, res) {
  const messages = await loadFeed(req.user);
  res.render('feed', { messages, errors: [], formData: {} });
}
