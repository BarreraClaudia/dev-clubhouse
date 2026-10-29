import express from 'express';
import path from 'node:path';
import indexRouter from './routes/indexRouter.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from './config/passport.js';
import pool from './db/pool.js';
import authRouter from './routes/authRouter.js';
import messageRouter from './routes/messageRouter.js';
import membershipRouter from './routes/membershipRouter.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) app.set('trust proxy', 1);

const __dirname = path.join(import.meta.dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const pgSession = connectPgSimple(session);

app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true, // creates the "session" table on first use
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction, // HTTPS only in production
    },
  }),
);

app.use(passport.session());

// Make the logged-in user available to every EJS view
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', messageRouter);
app.use('/', membershipRouter);

app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    heading: 'NOT FOUND',
    message: 'That route does not exist in this system.',
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error(err); // full details stay in your server logs
  res.status(500).render('error', {
    status: 500,
    heading: 'SYSTEM FAILURE',
    message: 'Something went wrong on our end. Try again in a moment.',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${port} (•‿•)`);
});
