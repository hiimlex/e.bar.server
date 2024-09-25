import { mockStore } from "mocks";
import mongoose from "mongoose";
import st from "supertest";
import { Endpoints } from "../../@types";
import { server } from "../../app";
import { TStore } from "./stores.model";

describe("Store test", () => {
	let mong: typeof mongoose;
	let createdStore: TStore;

	beforeEach(async () => {
		mong = await mongoose.connect(process.env.DB_URL || "");
	});

	afterAll(async () => {
		await mong.connection.close();
	});

	describe(`POST  ${Endpoints.StoreCreate}`, () => {
		it("should create a store", async () => {
			const res = await st(server.app)
				.post(Endpoints.StoreCreate)
				.send(mockStore);

			expect(res.statusCode).toBe(201);

			createdStore = res.body;
			expect(res.body).toBeTruthy();
		});
	});

	describe(`GET  ${Endpoints.StoreList}`, () => {
		it("should list all stores", async () => {
			const res = await st(server.app).get(Endpoints.StoreList);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeTruthy();
		});
	});

	describe(`GET  ${Endpoints.StoreListById}`, () => {
		it("should list a store by id", async () => {
			const res = await st(server.app).get(
				`${Endpoints.StoreListById.replace(
					":id",
					createdStore._id?.toString() || ""
				)}`
			);

			expect(res.statusCode).toBe(200);
			expect(res.body).toBeTruthy();
		});

		it("should return 400/404 if store it's not found", async () => {
			const res = await st(server.app).get(
				`${Endpoints.StoreListById.replace(":id", "123")}`
			);

			const is404or400 = res.statusCode === 400 || res.statusCode === 404;

			expect(is404or400).toBeTruthy();
		});

		it("should return 400/404 if id is not provided", async () => {
			const res = await st(server.app).get(Endpoints.StoreListById);

			const is404or400 = res.statusCode === 400 || res.statusCode === 404;

			expect(is404or400).toBeTruthy();
		});
	});

	describe(`PUT  ${Endpoints.StoreUpdate}`, () => {
		it("should return 400/404 if id is not provided", async () => {
			const res = await st(server.app).put(Endpoints.StoreUpdate);

			const is404or400 = res.statusCode === 400 || res.statusCode === 404;

			expect(is404or400).toBeTruthy();
		});

		it("should change store enabled to true", async () => {
			const res = await st(server.app)
				.put(
					`${Endpoints.StoreUpdate.replace(
						":id",
						createdStore._id?.toString() || ""
					)}`
				)
				.send({ enabled: true });

			expect(res.statusCode).toBe(201);
			expect(res.body).toBeTruthy();
			expect(res.body.enabled).toBe(true);
		});
	});

	describe(`DELETE  ${Endpoints.StoreDelete}`, () => {
		it("should return 400/404 if id is not provided", async () => {
			const res = await st(server.app).delete(Endpoints.StoreDelete);

			const is404or400 = res.statusCode === 400 || res.statusCode === 404;

			expect(is404or400).toBeTruthy();
		});

		it("should delete a store", async () => {
			const res = await st(server.app).delete(
				`${Endpoints.StoreDelete.replace(
					":id",
					createdStore._id?.toString() || ""
				)}`
			);

			expect(res.statusCode).toBe(204);
		});
	});
});
