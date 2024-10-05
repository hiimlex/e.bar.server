import { BaseController } from "@core";
import { AuthRepositoryImpl } from "./auth.repository";
import { Endpoints } from "types";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthLogin, AuthRepositoryImpl.login);

		this.router.get(
			Endpoints.AuthMe,
			AuthRepositoryImpl.is_authenticated,
			AuthRepositoryImpl.me
		);

		this.router.get(
			Endpoints.AuthValidateAttendanceCode,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.is_on_attendance,
			AuthRepositoryImpl.validate_attendance_code
		);

		this.router.get(
			Endpoints.AuthGetStore,
			AuthRepositoryImpl.is_store,
			AuthRepositoryImpl.get_store_by_token
		);

		this.router.get(
			Endpoints.AuthGetWaiter,
			AuthRepositoryImpl.is_waiter,
			AuthRepositoryImpl.get_waiter_by_token
		);

		this.router.get(
			Endpoints.AuthIsAuthenticated,
			AuthRepositoryImpl.is_authenticated
		);
	}
}
