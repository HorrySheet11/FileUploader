import { Router } from "express";
import passport from "passport";
import { fileUpload } from "../config/multer.js";
import * as userController from "../controllers/usersController.js";
import { isAuth,authEmail } from "./authenticator.js";

const userRouter = Router();

userRouter.get("/", isAuth, userController.home);
userRouter.get("/logIn", userController.loginGet);
userRouter.post(
	"/logIn",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/logIn",
	}),
);
userRouter.get("/logOut", userController.logout);
userRouter.get("/sign-up", userController.signUpGet);
userRouter.post("/sign-up", authEmail, userController.signUpPost);
userRouter.post(
	"/upload",
	fileUpload.single("file"),
	userController.tempUpload,
	// upload
);
userRouter.get("/file/:fileId", userController.inspectFile);
userRouter.get("/download/:fileId", userController.downloadFile);
userRouter.get("/folder/:folderId", userController.inspectFolder);
userRouter.post("/createFolder", userController.createFolder);

export default userRouter;