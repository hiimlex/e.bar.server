import { TStore } from "@modules";
import { create_mock_store } from "mocks";
import mongoose from "mongoose";
import st from "supertest";
import { Endpoints } from "types";
import { server } from "../../app";

describe("Auth tests", () => {
	let mong: typeof mongoose;
	let createdStore: TStore;
	let access_token: string;
	const mock_store = create_mock_store();

	beforeAll(async () => {
		const res = await st(server.app)
			.post(Endpoints.StoreCreate)
			.send(mock_store);
		createdStore = res.body;
	});

	beforeEach(async () => {
		mong = await mongoose.connect(process.env.DB_URL || "");
	});

	afterAll(async () => {
		await st(server.app).delete(
			Endpoints.StoreDelete.replace(":id", createdStore._id.toString())
		);

		await mong.connection.close();
	});

	describe(`POST ${Endpoints.AuthLogin}`, () => {
		it("should login an store", async () => {
			const res = await st(server.app).post(Endpoints.AuthLogin).send({
				email: mock_store.email,
				password: mock_store.password,
			});

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("access_token");
			expect(res.body).toHaveProperty("is_store");

			access_token = res.body.access_token;
		});
	});

	describe(`GET ${Endpoints.AuthGetStore}`, () => {
		it("should get store by token", async () => {
			const res = await st(server.app)
				.get(Endpoints.AuthGetStore)
				.set("Authorization", `Bearer ${access_token}`);

			expect(res.status).toBe(200);
			expect(res.body).toBeTruthy();
			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name");
		});

		it("should get an error if token is invalid", async () => {
			const res = await st(server.app)
				.get(Endpoints.AuthGetStore)
				.set("Authorization", `invalid_token`);

			expect(res.status).toBe(401);
		});

		it("should get an error if authorization header is missing", async () => {
			const res = await st(server.app).get(Endpoints.AuthGetStore);

			expect(res.status).toBe(401);
		});
	});
});
