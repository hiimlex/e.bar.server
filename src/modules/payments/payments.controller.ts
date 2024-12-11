import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { AuthRepositoryImpl } from "..";
import { PaymentsRepositoryImpl } from "./payments.repository";

export class PaymentsController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.PaymentList,
			AuthRepositoryImpl.is_authenticated,
			PaymentsRepositoryImpl.list
		);

		this.router.get(
			Endpoints.PaymentShowByOrder,
			AuthRepositoryImpl.is_authenticated,
			PaymentsRepositoryImpl.show_by_order_id
		);

		this.router.post(
			Endpoints.PaymentCreate,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			PaymentsRepositoryImpl.create
		);

		this.router.put(
			Endpoints.PaymentUpdate,
			AuthRepositoryImpl.is_waiter,
			PaymentsRepositoryImpl.update
		)

		this.router.put(
			Endpoints.PaymentFinish,
			AuthRepositoryImpl.is_waiter,
			PaymentsRepositoryImpl.finish
		)
	}
}
