import { AuthController, ProductsController, StoresController } from "@modules";
import { json } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";
export class Server {
	app!: Application;
	port!: number | string;
	private mong!: typeof mongoose;

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
		const stores_controller = new StoresController();
		const products_controller = new ProductsController();

		this.app.use(auth_controller.router);
		this.app.use(stores_controller.router);
		this.app.use(products_controller.router);
	}

	private set_middlewares(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	private async connect_mongo_db(): Promise<void> {
		try {
			this.mong = await mongoose.connect(process.env.DB_URL || "");

			console.log("Connected to MongoDB");
		} catch (error) {
			console.error("Error connecting to MongoDB: ", error);
		}
	}

	async close_mongo_db(): Promise<void> {
		if (this.mong) {
			try {
				await this.mong.connection.close();
			} catch (error) {
				console.error("Error closing MongoDB connection: ", error);
			}
		}
	}
}
