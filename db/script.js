import { prisma } from "./lib/prisma";

export async function signUp() {
	try {
		const user = await prisma.user.create({
			data: {
				name: "Alice",
				email: "alice@prisma.io",
				posts: {
					create: {
						title: "Hello World",
						content: "This is my first post!",
						published: true,
					},
				},
			},
			include: {
				posts: true,
			},
		});
		console.log("Created user:", user);
	} finally {
		await prisma.$disconnect();
	}
}

// Fetch all users with their posts
export async function allUsers() {
	try {
		await prisma.user.findMany({
			// include: {
			// 	posts: true,
			// },
		});
	} finally {
		await prisma.$disconnect();
	}
}
console.log("All users:", JSON.stringify(allUsers, null, 2));

// main()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
