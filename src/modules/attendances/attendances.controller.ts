import { BaseController } from "@core/base_controller";
import { Endpoints } from "types";
import { AttendanceRepositoryImpl } from "./attendances.repository";
import { AuthRepositoryImpl } from "@modules/auth";

export class AttendanceController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.get(
			Endpoints.AttendanceList,
			AuthRepositoryImpl.is_store,
			AttendanceRepositoryImpl.list
		);

		this.router.get(
			Endpoints.AttendanceGetByCode,
			AuthRepositoryImpl.is_waiter,
			AttendanceRepositoryImpl.get_by_code
		);

		this.router.get(
			Endpoints.AttendanceListById,
			AuthRepositoryImpl.is_store,
			AttendanceRepositoryImpl.list_by_id
		);

		this.router.post(
			Endpoints.AttendanceCreate,
			AuthRepositoryImpl.is_store,
			AttendanceRepositoryImpl.create
		);

		this.router.put(
			Endpoints.AttendanceUpdate,
			AuthRepositoryImpl.is_store,
			AttendanceRepositoryImpl.update
		);

		this.router.post(
			Endpoints.AttendanceValidateCode,
			AuthRepositoryImpl.is_waiter,
			AttendanceRepositoryImpl.validate_attendance_code
		);
	}
}
