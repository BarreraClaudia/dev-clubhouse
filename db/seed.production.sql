-- Demo authors for the live feed. Their password is an unrecoverable random
-- hash, so nobody can log in as them. They only exist to own the sample posts.
INSERT INTO users (first_name, last_name, username, password) VALUES
  ('Nova',  'Kessler', 'n0va_k',            '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2'),
  ('Mara',  'Linde',   'ghost_in_the_wire', '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2'),
  ('Theo',  'Okafor',  '0xB4DC0DE',         '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2'),
  ('Priya', 'Raman',   'root_canal',        '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2'),
  ('Jonas', 'Weber',   'sudo_sandwich',     '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2'),
  ('Ines',  'Duarte',  'null_pointer',      '$2b$10$/5T0rIzWbSS99CjR.7Nxa.jICoN4bkmjno8pjzG1Qm3IOP3c31Zh2');

INSERT INTO messages (title, text, created_at, user_id) VALUES
  ('Found a bug in my own code from 2019',
   'Off-by-one in a loop that ran in production for seven years. Nobody noticed. Fixed it. Now I am scared of everything else I wrote.',
   '2026-10-22 09:33-06', (SELECT id FROM users WHERE username = 'null_pointer')),
  ('[] == ![] is true and my brain has officially short-circuited',
   'An empty array is equal to the negation of an empty array. I am closing my laptop, walking into the woods, and starting a new life as a blacksmith. No types. No coercion. Just iron and fire.',
   '2026-10-23 02:09-06', (SELECT id FROM users WHERE username = 'ghost_in_the_wire')),
  ('My rubber duck asked for a transfer',
   'I spent three hours explaining my CSS grid issue to the plastic duck on my desk. It knocked itself off the table.',
   '2026-10-24 16:27-06', (SELECT id FROM users WHERE username = '0xB4DC0DE')),
  ('typeof NaN is ''number'' and I am filing a police report',
   'Not a number is a number. Excellent. Logical. I am going to print out the ECMAScript specification just so I can throw it into a fireplace.',
   '2026-10-24 23:41-06', (SELECT id FROM users WHERE username = 'root_canal')),
  ('Center a div simulator 2026',
   'I successfully centered a div on my screen today. Unfortunately, it broke the layout of three completely unrelated websites currently open in my browser tabs and turned my smart fridge off. Worth it.',
   '2026-10-25 18:02-06', (SELECT id FROM users WHERE username = 'sudo_sandwich')),
  ('Added z-index: 99999 and now the button is behind me',
   'I am writing this from inside the computer. The button has achieved physical sentience and has clipped through the desk. Please send help.',
   '2026-10-25 21:14-06', (SELECT id FROM users WHERE username = 'n0va_k'));