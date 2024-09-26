import { BaseController } from "@core";
import { Endpoints } from "@types";
import categoriesRepository from "./categories.repository";

export class CategoriesController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.CategoryCreate, categoriesRepository.create);
		this.router.get(Endpoints.CategoryList, categoriesRepository.list);
		this.router.get(Endpoints.CategoryListByStoreId, categoriesRepository.list_by_store_id);
		this.router.put(Endpoints.CategoryUpdate, categoriesRepository.update);
		this.router.delete(Endpoints.CategoryDelete, categoriesRepository.delete);
	}
}
