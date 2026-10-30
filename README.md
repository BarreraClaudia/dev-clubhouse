# dev_clubhouse

A members only message board. Anyone with an account can post and read, but only members can see **who** wrote each post and **when**. Unlock membership by "hacking in" with a secret key.

## Features

- Sign up and log in with validated forms and hashed passwords
- Three clearance levels (see below), each with its own look and permissions
- A message feed where authors and timestamps are **redacted** for non-members
- A terminal-style "join the club" screen that plays a hacking animation when the right secret key is entered
- A second terminal for the admin passcode
- Admin-only message deletion with a confirmation step
- Timestamps shown in each viewer's local time
- Themed 404 and error pages

## Clearance levels

| Level       | How you get it                             | What you can do                                                |
| ----------- | ------------------------------------------ | -------------------------------------------------------------- |
| **Recruit** | Sign up                                    | Read and post messages. Authors and timestamps are classified. |
| **Member**  | Enter the member passcode                  | Everything a recruit can do, plus see authors and timestamps.  |
| **Admin**   | Be a member, then enter the admin passcode | Everything a member can do, plus delete any message.           |

## Tech stack

- **Runtime:** Node.js (ES modules) and Express 5
- **Views:** EJS
- **Database:** PostgreSQL via `pg`
- **Auth:** Passport (`passport-local`), `bcryptjs`, `express-session` with `connect-pg-simple`
- **Validation:** `express-validator`
- **Rate limiting:** `express-rate-limit`

## Getting started

### Prerequisites

- Node.js 20.11 or later
- PostgreSQL, running locally

### Setup

```bash
git clone https://github.com/BarreraClaudia/dev-clubhouse.git
cd dev-clubhouse
npm install
```

Create a local database:

```bash
createdb dev_clubhouse
```

Copy the example environment file and fill it in:

```bash
cp .env.example .env
```

| Variable          | Description                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `DATABASE_URL`    | Postgres connection string, e.g. `postgresql://user:password@localhost:5432/dev_clubhouse` |
| `SESSION_SECRET`  | A long random string used to sign session cookies                                          |
| `MEMBER_PASSCODE` | The secret key that grants membership                                                      |
| `ADMIN_PASSCODE`  | The passcode that grants admin (use a different value from the member passcode)            |
| `NODE_ENV`        | Set to `production` when deployed                                                          |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create the tables and load sample data (local databases only):

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

Then open <http://localhost:3000>.

### Sample accounts

The development seed creates these accounts. Every password is `password123`.

| Username        | Clearance |
| --------------- | --------- |
| `admin_ada`     | Admin     |
| `n0va_k`        | Member    |
| `sudo_sandwich` | Recruit   |

The seed script refuses to run against any database that isn't on `localhost`, so these accounts can't end up in production by accident.

### Scripts

| Command           | What it does                                                                    |
| ----------------- | ------------------------------------------------------------------------------- |
| `npm run dev`     | Starts the server with `.env` loaded and auto-restart on changes                |
| `npm start`       | Starts the server for production (reads real environment variables, not `.env`) |
| `npm run db:seed` | Resets the local database tables and loads sample users and messages            |

## Project structure

```
├── app.js                    # Express setup and middleware
├── config/passport.js        # Passport local strategy
├── controllers/              # Request handlers (auth, messages, membership)
├── db/
│   ├── pool.js               # Postgres connection pool
│   ├── queries.js            # All SQL queries
│   ├── schema.sql            # Tables only, safe to run on any database
│   ├── seed.dev.js           # Local-only sample data
│   └── seed.production.sql   # Demo posts with unusable logins, for the live site
├── middleware/               # Route guards and rate limiters
├── public/                   # CSS and client-side scripts
├── routes/                   # Express routers
└── views/                    # EJS templates and partials
```

## Routes

| Route                       | Access     | Purpose                                             |
| --------------------------- | ---------- | --------------------------------------------------- |
| `GET /`                     | Public     | Landing page (redirects to the feed when logged in) |
| `GET/POST /sign-up`         | Logged out | Create an account                                   |
| `GET/POST /log-in`          | Logged out | Log in                                              |
| `GET /log-out`              | Logged in  | Log out                                             |
| `GET /feed`                 | Logged in  | Message feed                                        |
| `POST /messages`            | Logged in  | Post a message                                      |
| `GET/POST /join`            | Recruits   | Member passcode terminal                            |
| `GET/POST /admin`           | Members    | Admin passcode terminal                             |
| `POST /messages/:id/delete` | Admins     | Delete a message                                    |

## Security notes

- Passwords are hashed with bcrypt before they reach the database.
- All SQL uses parameterized queries.
- Redaction happens on the server. Authors and timestamps are never sent to the browser for non-members, so they can't be found in the page source.
- Passcodes are compared in constant time and are only ever read from environment variables.
- Log-in and passcode attempts are rate limited.
- Session cookies are `httpOnly` and `sameSite: 'lax'`, and `secure` in production.
- Changes are `POST` only, and every protected route is checked on the server, not just hidden in the UI.

## Deployment

The app needs a Node host and a PostgreSQL database.

1. Create the hosted database and run `db/schema.sql` against it.
2. Optionally run `db/seed.production.sql` once for demo posts. These authors have unusable passwords, so nobody can log in as them.
3. Create the web service with build command `npm install` and start command `npm start`.
4. Set `DATABASE_URL`, `SESSION_SECRET`, `MEMBER_PASSCODE`, `ADMIN_PASSCODE` and `NODE_ENV=production`.
5. Sign up, enter your production passcodes, and your account becomes the admin.

Do not run `db/seed.dev.js` on a live database. It creates accounts with a well-known password.

## License

ISC
