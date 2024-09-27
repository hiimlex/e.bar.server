import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { CloudinaryRepositoryImpl } from "./cloudinary.repository";

export class UploadController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(
			Endpoints.TestUpload,
			CloudinaryRepositoryImpl.multer.single("f"),
			CloudinaryRepositoryImpl.upload
		);
	}
}
