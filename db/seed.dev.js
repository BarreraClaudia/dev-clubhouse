#! /usr/bin/env node

import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const host = new URL(connectionString).hostname;
if (!['localhost', '127.0.0.1'].includes(host)) {
  console.error(
    `Refusing to seed development data into "${host}". This script is local-only.`,
  );
  process.exit(1);
}

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  username      VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  is_member     BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  text        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- empties both tables and resets the ids
TRUNCATE messages, users RESTART IDENTITY CASCADE;

-- Sample users
INSERT INTO users (first_name, last_name, username, password, is_member, is_admin) VALUES
  ('Ada',   'Lovelace', 'admin_ada',         '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', TRUE,  TRUE),
  ('Nova',  'Kessler',  'n0va_k',            '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', TRUE,  FALSE),
  ('Mara',  'Linde',    'ghost_in_the_wire', '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', TRUE,  FALSE),
  ('Theo',  'Okafor',   '0xB4DC0DE',         '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', TRUE,  FALSE),
  ('Priya', 'Raman',    'pri',               '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', TRUE,  FALSE),
  ('Jonas', 'Weber',    'sudo_sandwich',     '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', FALSE, FALSE),
  ('Ines',  'Duarte',   'null_pointer',      '$2b$10$sReUEHEDSf4yLcJiCvLHQ.5qdosS/rL3bW0IbJdEl6IW/Vf8bQOTK', FALSE, FALSE);

-- Sample messages
INSERT INTO messages (title, text, created_at, user_id) VALUES
  ('Added z-index: 99999 and now the button is behind me',
   'I am writing this from inside the computer. The button has achieved physical sentience and has clipped through the desk. Please send help.',
   '2026-10-22 09:33-06', (SELECT id FROM users WHERE username = 'n0va_k')),
  ('Center a div simulator 2026',
   'I successfully centered a div on my screen today. Unfortunately, it broke the layout of three completely unrelated websites currently open in my browser tabs and turned my smart fridge off. Worth it.',
   '2026-10-23 02:09-06', (SELECT id FROM users WHERE username = 'ghost_in_the_wire')),
  ('typeof NaN is ''number'' and I am filing a police report',
   'Not a number is a number. Excellent. Logical. I am going to print out the ECMAScript specification just so I can throw it into a fireplace.',
   '2026-10-24 16:27-06', (SELECT id FROM users WHERE username = '0xB4DC0DE')),
  ('My rubber duck asked for a transfer',
   'I spent three hours explaining my CSS grid issue to the plastic duck on my desk. It knocked itself off the table.',
   '2026-10-24 23:41-06', (SELECT id FROM users WHERE username = 'pri')),
  ('[] == ![] is true and my brain has officially short-circuited',
   'An empty array is equal to the negation of an empty array. I am closing my laptop, walking into the woods, and starting a new life as a blacksmith. No types. No coercion. Just iron and fire.',
   '2026-10-25 18:02-06', (SELECT id FROM users WHERE username = 'sudo_sandwich')),
  ('Found a bug in my own code from 2019',
   'Off-by-one in a loop that ran in production for seven years. Nobody noticed. Fixed it. Now I am scared of everything else I wrote.',
   '2026-10-25 21:14-06', (SELECT id FROM users WHERE username = 'null_pointer'));
`;

async function main() {
  console.log('seeding...');

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('done seeding');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
