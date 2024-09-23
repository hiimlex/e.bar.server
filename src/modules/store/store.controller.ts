import { BaseController } from "@core/base_controller";
import storeRepository from "./store.repository";
import { Endpoints } from "src/@types";

export class StoreController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(Endpoints.StoreList, storeRepository.list);
		this.router.get(Endpoints.StoreListById, storeRepository.list_by_id);
		this.router.post(Endpoints.StoreCreate, storeRepository.create);
		this.router.put(Endpoints.StoreUpdate, storeRepository.update);
		this.router.delete(Endpoints.StoreDelete, storeRepository.delete);

		this.router.get(Endpoints.StoreListProducts, storeRepository.list_products);
		this.router.get(Endpoints.StoreProfile, storeRepository.profile);
		
	}
}
