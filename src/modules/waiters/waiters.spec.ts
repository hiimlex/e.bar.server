import { TStore } from "@modules/stores";
import { create_mock_store, create_mock_waiter } from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { Endpoints } from "types";
import { server } from "../../app";

const test_server = supertest(server.app);
let mongo_server: MongoMemoryServer;
let mock_store: TStore = create_mock_store();
let created_store: TStore;
let access_token: string;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);

	created_store = (
		await test_server.post(Endpoints.StoreCreate).send(mock_store)
	).body;

	access_token = (
		await test_server.post(Endpoints.AuthLogin).send({
			email: mock_store.email,
			password: mock_store.password,
		})
	).body.access_token;
});

afterAll(async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}

	await mongoose.disconnect();
	await mongo_server.stop();
});

describe("GET /api/waiters", () => {
	it("should return waiters list by store", async () => {
		const { body, statusCode } = await test_server
			.get(Endpoints.WaiterList)
			.set("Authorization", `Bearer ${access_token}`);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty("content");
	});

	it("should return unauthorized status code if store is not authenticated", async () => {
		const { statusCode } = await test_server.get(Endpoints.WaiterList);

		expect(statusCode).toBe(401);
	});

	it('should attach "store_id" to the request query', async () => {});
});

describe("POST /api/waiters", () => {
	it("should return created waiter", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter, statusCode } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		expect(statusCode).toBe(201);
		expect(c_waiter).toHaveProperty("_id");
	});

	it("should return unauthorized status code if store is not authenticated", async () => {
		const mock_waiter = create_mock_waiter();
		const { statusCode } = await test_server
			.post(Endpoints.WaiterCreate)
			.send(mock_waiter);

		expect(statusCode).toBe(401);
	});
});

describe("PUT /api/waiters/:id", () => {
	it("should store update a waiter property", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		const { body, statusCode } = await test_server
			.put(Endpoints.WaiterUpdate.replace(":id", c_waiter._id))
			.set("Authorization", `Bearer ${access_token}`)
			.send({ enabled: false });

		expect(statusCode).toBe(201);
		expect(body.enabled).toBe(false);
	});

	it("should return unauthorized status code if store is not authenticated", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		const { statusCode } = await test_server
			.put(Endpoints.WaiterUpdate.replace(":id", c_waiter._id))
			.send({ enabled: false });

		expect(statusCode).toBe(401);
	});
});

describe("DELETE /api/tables/:id", () => {
	it("should store delete a waiter by id", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		const { statusCode } = await test_server
			.delete(Endpoints.WaiterDelete.replace(":id", c_waiter._id))
			.set("Authorization", `Bearer ${access_token}`);

		expect(statusCode).toBe(204);
	});

	it("should return unauthorized status code if store is not authenticated", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		const { statusCode } = await test_server.delete(
			Endpoints.WaiterDelete.replace(":id", c_waiter._id)
		);

		expect(statusCode).toBe(401);
	});
});

describe("PUT /api/waiters/profile", () => {
	it("should waiter update his profile", async () => {
		const mock_waiter = create_mock_waiter();
		const { body: c_waiter } = await test_server
			.post(Endpoints.WaiterCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_waiter);

		const {
			body: { access_token: w_access_token, is_store },
		} = await test_server
			.post(Endpoints.AuthLogin)
			.send({ email: mock_waiter.email, password: mock_waiter.password });

		console.log(w_access_token, is_store);

		const { body, statusCode } = await test_server
			.put(Endpoints.WaiterUpdateProfile)
			.set("Authorization", `Bearer ${w_access_token}`)
			.send({ name: "new name" });

		expect(statusCode).toBe(201);
		expect(body.name).toBe("new name");
	});
});
