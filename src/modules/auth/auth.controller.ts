import { BaseController } from "@core";
import {AuthRepositoryImpl} from "./auth.repository";
import { Endpoints } from "types";

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	define_routes(): void {
		this.router.post(Endpoints.AuthLogin, AuthRepositoryImpl.login);
		this.router.get(
			Endpoints.AuthGetStore,
			AuthRepositoryImpl.is_authenticated,
			AuthRepositoryImpl.get_store_by_token
		);
		this.router.get(Endpoints.AuthIsAuthenticated, AuthRepositoryImpl.is_authenticated);
	}
}
