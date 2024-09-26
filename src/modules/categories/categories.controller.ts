import { BaseController } from "@core";
import { Endpoints } from "types";
import categoriesRepository from "./categories.repository";
import { AuthRepository } from "..";

export class CategoriesController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(Endpoints.CategoryList, categoriesRepository.list);
		this.router.get(
			Endpoints.CategoryListByStoreId,
			categoriesRepository.list_by_store_id
		);

		this.router.post(
			Endpoints.CategoryCreate,
			AuthRepository.is_store,
			categoriesRepository.create
		);
		this.router.put(
			Endpoints.CategoryUpdate,
			AuthRepository.is_store,
			categoriesRepository.update
		);
		this.router.delete(
			Endpoints.CategoryDelete,
			AuthRepository.is_store,
			categoriesRepository.delete
		);
	}
}
