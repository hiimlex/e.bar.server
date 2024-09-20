import { json } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";
import { AuthController } from "src/modules";
export class Server {
	app!: Application;
	port!: number | string;
	api_prefix = process.env.API_PREFIX || "/api";

	constructor(port: number | string) {
		this.app = express();
		this.port = port;

		this.set_middlewares();
		this.init_routes();

		this.connect_mongo_db();
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

	private set_middlewares(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	private async connect_mongo_db(): Promise<void> {
		try {
			await mongoose.connect(process.env.DB_URL || "").then(() => {
				console.log("Connected to MongoDB");
			});
		} catch (error) {
			console.error("Error connecting to MongoDB: ", error);
		}
	}
}
