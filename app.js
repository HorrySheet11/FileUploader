import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import routes from "./routers/usersRouter.js";
import "./config/passport.js";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './lib/prisma.js'

const app = express();
const __dirname = import.meta.dirname;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	console.log(req.session);
	console.log(req.user);
	next();
});
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/", routes);
const port = process.env.PORT || 3000;
app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`app listening on port ${port}!`);
});
