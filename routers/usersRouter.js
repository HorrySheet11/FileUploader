import { Router } from "express";
import passport from "passport";
import { fileUpload } from "../config/multer.js";
import * as userController from "../controllers/usersController.js";
import * as fileController from "../controllers/fileController.js";
import * as folderController from "../controllers/folderController.js";
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

userRouter.get("/folder/:folderId", folderController.inspectFolder);
userRouter.post("/createFolder", folderController.createFolder);
userRouter.post("/renameFolder/:folderId", folderController.renameFolder);
userRouter.post("/deleteFolder/:folderId", folderController.deleteFolder);

userRouter.get("/file/:fileId", fileController.inspectFile);
userRouter.get("/download/:fileId", fileController.downloadFile);
userRouter.post(
	"/upload",
	fileUpload.single("file"),
	fileController.upload
);
userRouter.post('/folder/upload/:folderId', fileUpload.single('file'), fileController.uploadFileInFolder)
export default userRouter;