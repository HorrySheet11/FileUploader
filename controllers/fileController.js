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
	// try {
	const file = req.file;
	console.log(file);
	if (!file) {
		res.status(400).json({ message: "Please upload a file" });
		return;
	}
	//add to supabase bucket db
	const { data, error } = await supabase.storage
		.from("fileUploaderStorage")
		.upload(`storage/${file.originalName}`, file.buffer, {upsert: false});
  data ? console.log(data) : console.log(error);
	//add to db
	const newFile = await prisma.files.create({
		data: {
			fileName: file.originalname,
			fileSize: file.size,
			filePath: `storage/${file.originalname}`,
			mimeType: file.mimetype,
			user: {
				connect: {
					id: req.user.id,
				},
			},
		},
	});
  console.log(newFile)
	// } catch (error) {
	//   console.error(error);
	//   res.status(500).json({ message: 'Error uploading file', error });
	// }
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
			.from("File Uploader app")
			.upload(`fileUploader/${file.originalName}`, file.originalName, {
				cacheControl: "3600",
				upsert: false,
			});
		await prisma.files.create({
			data: {
				fileName: file.originalName,
				fileSize: file.size,
				filePath: file.path,
				mimeType: file.mimetype,
				user: {
					connect: {
						id: req.user.id,
					},
				},
				folder: {
					connect: {
						id: parseInt(req.params.folderId),
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
			id: req.params.fileId,
		},
	});
	res.render("inspectFile", {
		files: file,
	});
}

export async function tempUpload(req, res) {
	console.log(`filename: ${req.file.filename}`);
	res.redirect("/");
}
