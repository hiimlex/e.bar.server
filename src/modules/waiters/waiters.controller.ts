import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { WaitersRepositoryImpl } from "./waiters.repository";

export class WaitersController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.WaiterList, WaitersRepositoryImpl.list);
		this.router.post(Endpoints.WaiterListById, WaitersRepositoryImpl.list_by_id);
		this.router.post(Endpoints.WaiterProfile, WaitersRepositoryImpl.profile);
		this.router.post(Endpoints.WaiterCreate, WaitersRepositoryImpl.create);
		this.router.post(Endpoints.WaiterUpdate, WaitersRepositoryImpl.update);
		this.router.post(Endpoints.WaiterDelete, WaitersRepositoryImpl.delete);
	}
}
