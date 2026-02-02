import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as AnonymousStrategy } from "passport-anonymous";
import bcrypt from "bcrypt";
// import pool from "../db/pool";
import {prisma} from "../lib/prisma.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const userName = req.body.username;       
      try {

        // const { rows } = await pool.query(
        //   "SELECT * FROM members WHERE firstname = $1 and lastname = $2 and email = $3",
        //   [userName, username],
        // );
        const user = await prisma.user.findUnique({
          where:{
            username: userName,
            email: username
          }
        });
        req.session.messages = [];
        if (!user) {
          return done(null, false, { message: "Incorrect first, last name or email" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    },
  ),
);

// passport.use(new AnonymousStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const { rows } = await pool.query(
    //   "SELECT * FROM members WHERE member_id = $1",
    //   [id],
    // );
    const user = await prisma.user.findUnique({
          where:{
            id,
          }
        });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export {passport};
