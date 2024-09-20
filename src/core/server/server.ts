import express, { Application } from "express";
import { AuthController } from "src/modules";
export class Server {
	app!: Application;
	port!: number | string;
	api_prefix = process.env.API_PREFIX || "/api";

	constructor(port: number | string) {
		this.app = express();
		this.port = port;
	}

	start(): void {
		this.app.listen(this.port, () => {
			console.log(`Server started at port ${this.port}`);
		});
	}

	private init_routes(): void {
		const auth_controller = new AuthController();

		this.app.use(this.api_prefix, auth_controller.router);
	}

	private set_middlewares(): void {}

	private async connect_mongo_db(): Promise<void> {}
}
