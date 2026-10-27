import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { getUserByUsername, getUserById } from '../db/queries.js';

// How a user is verified at log-in
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      const match = user && (await bcrypt.compare(password, user.password));

      // Same message either way, so attackers can't tell which usernames exist
      if (!match) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

// What gets stored in the session: just the id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// On every request, turn that id back into a full user (becomes req.user)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
