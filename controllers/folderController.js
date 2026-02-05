import { prisma } from "../lib/prisma.js";

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
	res.render("inspectFolder", {
		files: folder.file,
		folder: folder
	});
}



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

export async function renameFolder(req,res){
	await prisma.folder.update({
		where: {
			id: parseInt(req.params.folderId),
		},
		data: {
			folderName: req.body.folderName,
		},
	});
	res.redirect(`/folder/${req.params.folderId}`);
}

export async function deleteFolder(req,res){
	await prisma.folder.delete({
		where: {
			id: parseInt(req.params.folderId),
		},
	});
	res.redirect("/");
}