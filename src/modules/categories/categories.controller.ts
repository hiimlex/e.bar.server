import { BaseController } from "@core";
import { Endpoints } from "types";
import { CategoriesRepositoryImpl } from "./categories.repository";
import { AuthRepositoryImpl } from "..";

export class CategoriesController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.CategoryList,
			AuthRepositoryImpl.is_authenticated,
			CategoriesRepositoryImpl.list
		);
		
		this.router.get(
			Endpoints.CategoryListByStoreId,
			CategoriesRepositoryImpl.list_by_store_id
		);

		this.router.post(
			Endpoints.CategoryCreate,
			AuthRepositoryImpl.is_store,
			CategoriesRepositoryImpl.create
		);
		this.router.put(
			Endpoints.CategoryUpdate,
			AuthRepositoryImpl.is_store,
			CategoriesRepositoryImpl.update
		);
		this.router.delete(
			Endpoints.CategoryDelete,
			AuthRepositoryImpl.is_store,
			CategoriesRepositoryImpl.delete
		);
	}
}
