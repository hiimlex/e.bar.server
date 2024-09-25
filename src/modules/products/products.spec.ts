import mongoose from "mongoose";
import { TProduct } from "./products.model";
import { Endpoints } from "@types";
import { server } from "app";
import { mockProduct } from "mocks";
import st from "supertest";

describe("Product test", () => {
	let mong: typeof mongoose;
	let createdProduct: TProduct;

	beforeEach(async () => {
		mong = await mongoose.connect(process.env.DB_URL || "");
	});

	afterAll(async () => {
		await mong.connection.close();
	});

	describe(`POST  ${Endpoints.ProductCreate}`, () => {
		it("should create a product", async () => {
			const res = await st(server.app)
				.post(Endpoints.ProductCreate)
				.send(mockProduct);

			expect(res.statusCode).toBe(201);

			createdProduct = res.body;
			expect(res.body).toBeTruthy();
		});
	});
});
