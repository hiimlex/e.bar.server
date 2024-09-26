import mongoose from "mongoose";
import { Endpoints } from "@types";
import { server } from "app";
import { mockCategory, mockProduct } from "mocks";
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
				.send(mockCategory);

			expect(res.statusCode).toBe(201);

			createdCategory = res.body;
			expect(res.body).toBeTruthy();
		});
	});

	describe(`GET  ${Endpoints.CategoryCreate}`, () => {
		it("should list all categories", async () => {
			const res = await st(server.app).get(Endpoints.CategoryList);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeTruthy();
		});
	});

	describe(`GET  ${Endpoints.CategoryListByStoreId}`, () => {
		it("should list all categories by store id", async () => {
			const res = await st(server.app).get(
				Endpoints.CategoryListByStoreId.replace(
					":store_id",
					createdCategory.store_id.toString()
				)
			);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeTruthy();
		});
	});

	describe(`PUT  ${Endpoints.CategoryUpdate}`, () => {
		it("should update a category", async () => {
			const res = await st(server.app)
				.put(
					`${Endpoints.CategoryUpdate.replace(
						":id",
						createdCategory._id.toString()
					)}`
				)
				.send({ name: "Updated Category" });

			expect(res.statusCode).toBe(201);
			createdCategory = res.body;
			expect(res.body).toBeTruthy();
			expect(res.body.name).toBe("Updated Category");
		});
	});

	describe(`DELETE ${Endpoints.CategoryDelete}`, () => {
		it("should delete a category", async () => {
			const res = await st(server.app).delete(
				Endpoints.CategoryDelete.replace(":id", createdCategory._id.toString())
			);

			expect(res.statusCode).toBe(204);
		});
	});
});
