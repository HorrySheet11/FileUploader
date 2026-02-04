import { prisma } from "../lib/prisma.js";
export const isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/logIn");
	}
};

export const authEmail = async (req, res, next) => {
	const isEmail = await prisma.user.findFirst({
		where: {
			email: req.body.email,
		},
	})
	if (isEmail) {
		req.session.message = "Email already exists"
		res.redirect("/sign-up");
	} else {
		next();
	}
}
