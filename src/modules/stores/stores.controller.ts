import { BaseController } from "@core";
import { Endpoints } from "types";
import storesRepository from "./stores.repository";
import { AuthRepository } from "../auth";

export class StoresController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(Endpoints.StoreList, storesRepository.list);
		this.router.get(
			Endpoints.StoreProfile,
			AuthRepository.is_store,
			storesRepository.profile
		);
		this.router.get(Endpoints.StoreListById, storesRepository.list_by_id);
		this.router.post(Endpoints.StoreCreate, storesRepository.create);
		this.router.put(Endpoints.StoreUpdate, storesRepository.update);
		this.router.delete(Endpoints.StoreDelete, storesRepository.delete);

		this.router.get(
			Endpoints.StoreListProducts,
			storesRepository.list_products
		);

	
	}
}
