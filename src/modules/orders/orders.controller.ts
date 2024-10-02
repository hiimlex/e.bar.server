import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { WaiterOrdersRepositoryImpl } from "./waiter_orders.repository";
import { AuthRepositoryImpl } from "@modules/auth";

export class OrdersController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.WaiterOrderList,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.list
		);

		this.router.post(
			Endpoints.WaiterOrderCreate,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.create
		);
		this.router.put(
			Endpoints.WaiterOrderUpdate,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.update
		);
		this.router.put(
			Endpoints.WaiterOrderCancel,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.cancel
		);
		this.router.put(
			Endpoints.WaiterOrderFinish,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.finish
		);

		this.router.get(
			Endpoints.WaiterOrderShowById,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			WaiterOrdersRepositoryImpl.show_by_id
		);
	}
}
