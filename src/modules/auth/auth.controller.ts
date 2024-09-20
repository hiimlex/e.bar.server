import { BaseController } from "@core/base_controller";
import AuthRepository from "./auth.repository";
import { Endpoints } from "src/@types";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.Login, AuthRepository.login);
	}
}
