import { supabase } from "../config/supabase.js";
import { prisma } from "../lib/prisma.js";
import fs from "fs";

export async function downloadFile(req, res) {
	const fileRequest = await prisma.files.findUnique({
		where: {
			id: parseInt(req.params.fileId, 10),
		},
	});

	const { data, error } = await supabase.storage
		.from("fileUploaderStorage")
		.download(fileRequest.filePath);
  const result = data ? data : error;
		console.log(result);
	if (error) return res.status(500).send(error.message);

    const buffer = Buffer.from(await data.arrayBuffer());

    res.set({
      'Content-Type': fileRequest.mimeType, 
      'Content-Disposition': `attachment; filename="${fileRequest.fileName}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
}

export async function upload(req, res) {
	try {
		const file = req.file;

    if (!file) {
      res.status(400).json({ message: "Please upload a file" });
      return;
    }
    const isDuplicate = await prisma.files.findFirst({
      where: {
        fileName: file.originalname,
        user: {
          id: parseInt(req.user.id, 10),
        },
      },
    });
    if (isDuplicate) {
      res.status(400).json({ message: "File already exists" });
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
    const isDuplicate = await prisma.files.findFirst({
      where: {
        fileName: file.originalname,
        user: {
          id: parseInt(req.user.id, 10),
        },
      },
    });
    if (isDuplicate) {
      res.status(400).json({ message: "File already exists" });
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
		await prisma.files.create({
			data: {
				fileName: file.originalname,
				fileSize: file.size,
				filePath: `storage/userId${req.user.id}/${file.originalname}`,
				mimeType: file.mimetype,
				user: {
					connect: {
						id: parseInt(req.user.id, 10),
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

