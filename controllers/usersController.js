import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export async function home(req, res) {
	res.render("index", {
		user: req.user,
		folders: await prisma.folder.findMany({
			where: {
				user: {
					id: res.locals.currentUser.id,
				},
			}
		}),
		files: await prisma.files.findMany({
			where: {
				user: {
					id: res.locals.currentUser.id,
				},
			}
		}),
	});
}

export function loginGet(req, res) {
	res.render("log-in");
}

export function logout(req, res) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/logIn");
	});
}

export function signUpGet(req, res) {
	res.render("sign-up",{
		message : req.session.message
	});
}

export async function signUpPost(req, res, next) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		//USE PRISMA
		// console.log(req.body);
		// await query.signUp(req.body.username, req.body.email, hashedPassword);
		await prisma.user.create({
			data: {
				name: req.body.username,
				email: req.body.email,
				password: hashedPassword,
			},
		});
		res.redirect("/logIn");
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export async function upload(req, res) {
	await prisma.files.create({
		data: {
			name: req.file.filename,
			file: req.file,
			user: {
				connect: {
					id: req.user.id,
				},
			},
		},
	});
}

export async function tempUpload(req, res) {
	console.log(`filename: ${req.file.filename}`);
	res.redirect("/");
}

export async function inspectFile(req, res) {
	const file = await prisma.files.findUnique({
		where: {
			id: req.params.fileId,
		},
	});
	res.render("inspectFile", {
		files: file,
	});
}

export async function inspectFolder(req, res) {
	const folder = await prisma.folder.findUnique({
		where: {
			id: parseInt(req.params.folderId),
		},
		select: {
			folderName: true,
			id: true,
			file: true,
		}
	});
	console.log(folder);
	res.render("inspectFolder", {
		files: folder.file,
		folder: folder
	});
}

export async function downloadFile(req, res) {}

export async function createFolder(req, res) {
	await prisma.folder.create({
		data: {
			folderName: req.body.folderName,
			user: {
				connect: {
					id: res.locals.currentUser.id,
				},
			},
		},
	});
	res.redirect("/");
}
