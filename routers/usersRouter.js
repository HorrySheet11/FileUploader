import { Router } from "express";
import passport from "passport";
import {home, loginGet, signUpGet, signUpPost, upload, tempUpload} from "../controllers/usersController.js";
import { isAuth } from "./authenticator.js";
import { fileUpload } from "../config/multer.js";

const userRouter = Router();

userRouter.get("/", isAuth, home);
userRouter.get("/log-in", loginGet);
userRouter.post(
	"/log-in",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/log-in",
	}),
);
userRouter.get("/sign-up", signUpGet);
userRouter.post("/sign-up", signUpPost);
userRouter.post('/upload', fileUpload.single('file'), tempUpload
// upload
)

export default userRouter;
