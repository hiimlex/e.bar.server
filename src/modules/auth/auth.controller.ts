import { BaseController } from "@core";
import AuthRepository from "./auth.repository";
import { Endpoints } from "@types";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthLogin, AuthRepository.login);
	}
}
