import { json } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { routers } from "./routes";
import { JWT_SECRET } from "types";
export class Server {
	app!: Application;
	port!: number | string;
	corsOptions = {
		origin: [process.env.FRONTEND_URL || "http://localhost:3001", "http://192.168.1.116:3001"],
		credentials: true,
	};

	constructor(port: number | string) {
		this.app = express();
		this.port = port;

		this.set_middlewares();
		this.init_routes();

		this.connect_mongo_db();
	}

	start(): void {
		if (process.env.NODE_ENV !== "test") {
			this.app.listen(this.port, () => {
				console.log(`Server started at port ${this.port}`);
			});
		}
	}

	private init_routes(): void {
		routers.forEach((router) => {
			this.app.use(router);
		});
	}

	private set_middlewares(): void {
		this.app.use(json());
		this.app.use(cors(this.corsOptions));
		this.app.use(cookieParser(JWT_SECRET));
	}

	private async connect_mongo_db(): Promise<void> {
		if (process.env.NODE_ENV !== "test") {
			try {
				await mongoose.connect(process.env.DB_URL || "");

				console.log("Connected to MongoDB");
			} catch (error) {
				console.error("Error connecting to MongoDB: ", error);
			}
		}
	}

	async close_mongo_db(): Promise<void> {
		try {
			await mongoose.disconnect();
		} catch (error) {
			console.error("Error closing MongoDB connection: ", error);
		}
	}
}
