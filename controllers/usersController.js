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










