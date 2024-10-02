import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { TablesRepositoryImpl } from "./tables.repository";
import { AuthRepositoryImpl } from "@modules/auth";

export class TablesController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.TableList,
			AuthRepositoryImpl.is_store,
			TablesRepositoryImpl.list
		);
		this.router.post(
			Endpoints.TableCreate,
			AuthRepositoryImpl.is_store,
			TablesRepositoryImpl.create
		);
		this.router.put(
			Endpoints.TableUpdate,
			AuthRepositoryImpl.is_store,
			TablesRepositoryImpl.update
		);
		this.router.delete(
			Endpoints.TableDelete,
			AuthRepositoryImpl.is_store,
			TablesRepositoryImpl.delete
		);
	}
}
