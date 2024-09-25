import { BaseController } from "@core";
import { Endpoints } from "@types";
import productsRepository from "./products.repository";

export class ProductsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.ProductCreate, productsRepository.create);
		this.router.get(Endpoints.ProductList, productsRepository.list);
		this.router.get(Endpoints.ProductListById, productsRepository.list_by_id);
		this.router.put(Endpoints.ProductUpdate, productsRepository.update);
		this.router.delete(Endpoints.ProductDelete, productsRepository.delete);
	}
}
