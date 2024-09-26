import { BaseController } from "@core";
import AuthRepository from "./auth.repository";
import { Endpoints } from "types";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthLogin, AuthRepository.login);
		this.router.get(
			Endpoints.AuthGetStore,
			AuthRepository.is_authenticated,
			AuthRepository.get_store_by_token
		);
		this.router.get(Endpoints.AuthIsAuthenticated, AuthRepository.is_authenticated);
	}
}
