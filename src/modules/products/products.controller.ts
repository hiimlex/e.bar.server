import { BaseController } from "@core";
import { Endpoints } from "types";
import { ProductsRepositoryImpl } from "./products.repository";
import { AuthRepositoryImpl } from "../auth";
import { CloudinaryRepositoryImpl } from "@modules/cloudinary";

export class ProductsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.ProductList,
			AuthRepositoryImpl.is_authenticated,
			ProductsRepositoryImpl.list
		);
		this.router.get(
			Endpoints.ProductListById,
			ProductsRepositoryImpl.list_by_id
		);

		this.router.post(
			Endpoints.ProductCreate,
			CloudinaryRepositoryImpl.multer.single("file"),
			AuthRepositoryImpl.is_store,
			ProductsRepositoryImpl.create
		);
		this.router.put(
			Endpoints.ProductUpdate,
			CloudinaryRepositoryImpl.multer.single("file"),
			AuthRepositoryImpl.is_store,
			ProductsRepositoryImpl.update
		);
		this.router.delete(
			Endpoints.ProductDelete,
			AuthRepositoryImpl.is_store,
			ProductsRepositoryImpl.delete
		);
	}
}
