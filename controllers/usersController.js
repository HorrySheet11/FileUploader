import bcrypt from "bcryptjs";
import {prisma} from "../lib/prisma.js";

export function home(req, res) {
	res.render("index", {
		user: req.user,
	});
}

export function loginGet(req, res) {
	res.render("log-in");
}

export function signUpGet(req, res) {
	res.render("sign-up");
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
        password: hashedPassword
      }
    })
		res.redirect("/log-in");
	} catch (error) {
		console.error(error);
		next(error);
	}
}

