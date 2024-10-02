import { BaseController } from "@core";
import { Endpoints } from "types";
import { StoresRepositoryImpl } from "./stores.repository";
import { AuthRepositoryImpl } from "../auth";
import { CloudinaryRepositoryImpl } from "@modules/cloudinary";

export class StoresController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		// Lists
		this.router.get(Endpoints.StoreList, StoresRepositoryImpl.list);
		this.router.get(
			Endpoints.StoreProfile,
			AuthRepositoryImpl.is_store,
			StoresRepositoryImpl.profile
		);
		this.router.get(
			Endpoints.StoreListProducts,
			StoresRepositoryImpl.list_products
		);

		// Get by ID
		this.router.get(Endpoints.StoreListById, StoresRepositoryImpl.list_by_id);

		// Updates
		this.router.post(Endpoints.StoreCreate, StoresRepositoryImpl.create);
		this.router.put(
			Endpoints.StoreUpdateAvatar,
			CloudinaryRepositoryImpl.multer.single("avatar")
		);
		this.router.put(
			Endpoints.StoreUpdateThumbnail,
			CloudinaryRepositoryImpl.multer.single("thumbnail")
		);
		this.router.put(Endpoints.StoreUpdate, StoresRepositoryImpl.update);
		this.router.delete(Endpoints.StoreDelete, StoresRepositoryImpl.delete);
	}
}
