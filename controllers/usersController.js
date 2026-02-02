import bcrypt from "bcryptjs";

export function home(req, res) {
	res.render("index", {
		user: req.user,
	});
}

export function loginGet(req, res) {
	res.render("log-in");
}

export function signUpGet(req, res) {
	res.render("sign-up-form");
}

export async function signUpPost(req, res) {
	try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
		//USE PRISMA
		// console.log(req.body);
		await query.signUp(req.body.username, req.body.email, hashedPassword);
		res.redirect("/log-in");
	} catch (error) {
		console.error(error);
		next(error);
	}
}

