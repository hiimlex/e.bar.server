import { HttpException } from "@core/server";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import multer from "multer";
import { TUploadedFile } from "types/files";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

class CloudinaryRepository {
	private config = cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_KEY,
		api_secret: process.env.CLOUDINARY_SECRET,
	});

	private storage = new CloudinaryStorage({
		cloudinary,
		params: {
			folder: "uploads",
			allowedFormats: ["jpeg", "png", "jpg"],
		},
	});

	multer = multer({ storage: this.storage });

	destroy: (name: string, cb?: () => void | Promise<void>) => Promise<void> =
		cloudinary.uploader.destroy;

	async upload(req: Request, res: Response): Promise<Response<TUploadedFile>> {
		try {
			if (!req.file) {
				throw new HttpException(400, "FILE_NOT_FOUND");
			}

			const result = req.file as TUploadedFile;

			return res.json(result);
		} catch (error) {
			console.log(error);
			return handle_error(res, error);
		}
	}
}

const CloudinaryRepositoryImpl = new CloudinaryRepository();

export { CloudinaryRepositoryImpl };
