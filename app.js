import express from 'express';
import path from 'node:path';
import indexRouter from './routes/indexRouter.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from './config/passport.js';
import pool from './db/pool.js';
import authRouter from './routes/authRouter.js';

const app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${port} (•‿•)`);
});
