import mongoose from "mongoose";
import { Endpoints } from "@types";
import { server } from "app";
import { mockProduct } from "mocks";
import st from "supertest";
import { TCategory } from "./categories.model";

describe("Category test", () => {
	let mong: typeof mongoose;
	let createdCategory: TCategory;

	beforeEach(async () => {
		mong = await mongoose.connect(process.env.DB_URL || "");
	});

	afterAll(async () => {
		await mong.connection.close();
	});

	describe(`POST  ${Endpoints.CategoryCreate}`, () => {
		it("should create a category", async () => {
			const res = await st(server.app)
				.post(Endpoints.CategoryCreate)
				.send(mockProduct);

			expect(res.statusCode).toBe(201);

			createdCategory = res.body;
			expect(res.body).toBeTruthy();
		});
	});
});
