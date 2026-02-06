import { supabase } from "../config/supabase.js";
import { prisma } from "../lib/prisma.js";

export async function downloadFile(req, res) {
	const fileRequest = await prisma.files.findUnique({
		where: {
			id: req.params.fileId,
		},
	});

	const file = await supabase.storage
		.from("File Uploader app")
		.download(fileRequest.filePath);

	res.redirect(file.filePath, {
		headers: {
			"Content-Type": file.mimeType,
		},
	});
}

export async function upload(req, res) {
	try {
		const file = req.file;
		console.log(file);
		if (!file) {
			res.status(400).json({ message: "Please upload a file" });
			return;
		}
		const { data, error } = await supabase.storage
			.from("fileUploaderStorage")
			.upload(
				`storage/userId${req.user.id}/${file.originalname}`,
				file.buffer,
				{ upsert: false },
			);
		const result = data ? data : error;
		console.log(`result: ${result}`);
		await prisma.files.create({
			data: {
				fileName: file.originalname,
				fileSize: file.size,
				filePath: `storage/userId${req.user.id}/${file.originalname}`,
				mimeType: file.mimetype,
				user: {
					connect: {
						id: req.user.id,
					},
				},
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error uploading file", error });
	}
	res.redirect("/");
}

export async function uploadFileInFolder(req, res) {
	try {
		const file = req.file;
		if (!file) {
			res.status(400).json({ message: "Please upload a file" });
			return;
		}
		const { data, error } = await supabase.storage
			.from("fileUploaderStorage")
			.upload(
				`storage/userId${req.user.id}/${file.originalname}`,
				file.buffer,
				{ upsert: false },
			);
		const result = data ? data : error;
		console.log(`result: ${result}`);
		await prisma.files.create({
			data: {
				fileName: file.originalname,
				fileSize: file.size,
				filePath: `storage/userId${req.user.id}/${file.originalname}`,
				mimeType: file.mimetype,
				user: {
					connect: {
						id: req.user.id,
					},
				},
				folder: {
					connect: {
						id: parseInt(req.params.folderId, 10),
					},
				},
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error uploading file" });
	}
}

export async function inspectFile(req, res) {
	const file = await prisma.files.findUnique({
		where: {
			id: parseInt(req.params.fileId, 10)
		},
    include: {
      folder: true,
      user: true
    }
	});
  console.log(file);
	res.render("inspectFile", {
		file: file,
	});
}

