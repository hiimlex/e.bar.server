import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { WaitersRepositoryImpl } from "./waiters.repository";
import { AuthRepositoryImpl } from "@modules/auth";
import { CloudinaryRepositoryImpl } from "@modules/cloudinary";

export class WaitersController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.WaiterList,
			AuthRepositoryImpl.is_store,
			WaitersRepositoryImpl.list
		);

		this.router.get(
			Endpoints.WaiterProfile,
			AuthRepositoryImpl.is_waiter,
			WaitersRepositoryImpl.profile
		);

		this.router.post(
			Endpoints.WaiterCreate,
			AuthRepositoryImpl.is_store,
			WaitersRepositoryImpl.create
		);
		this.router.put(
			Endpoints.WaiterUpdateProfile,
			CloudinaryRepositoryImpl.multer.single("file"),
			AuthRepositoryImpl.is_waiter,
			WaitersRepositoryImpl.update_profile
		);

		this.router.get(
			Endpoints.WaiterListById,
			AuthRepositoryImpl.is_store,
			WaitersRepositoryImpl.list_by_id
		);

		this.router.put(
			Endpoints.WaiterUpdate,
			AuthRepositoryImpl.is_store,
			WaitersRepositoryImpl.update
		);

		this.router.delete(
			Endpoints.WaiterDelete,
			AuthRepositoryImpl.is_store,
			WaitersRepositoryImpl.delete
		);
	}
}
