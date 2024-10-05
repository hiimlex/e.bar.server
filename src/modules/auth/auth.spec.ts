import { TStore } from "@modules";
import { create_mock_store, create_mock_waiter } from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Endpoints } from "types";
import { test_agent } from "../../app";

let test_server = test_agent;
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

describe("POST /api/auth/login", () => {
	it("should login an store", async () => {
		const res = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_store.email,
			password: mock_store.password,
		});

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("access_token");
		expect(res.body).toHaveProperty("is_store");
		expect(res.body.is_store).toBeTruthy();
	});

	it("should login a waiter", async () => {
		const mock_waiter = create_mock_waiter();
		await test_server
			.post(Endpoints.WaiterCreate)
			.send(mock_waiter)
			.set("Authorization", `Bearer ${access_token}`);

		const res = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_waiter.email,
			password: mock_waiter.password,
		});

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty("access_token");
		expect(res.body).toHaveProperty("is_store");
		expect(res.body.is_store).toBeFalsy();
	});
});

describe("GET /api/auth/get-store", () => {
	it("should get store by token", async () => {
		const res = await test_server
			.get(Endpoints.AuthGetStore)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("name");
	});

	it("should get an error if token is invalid", async () => {
		const res = await test_server
			.get(Endpoints.AuthGetStore)
			.set("Authorization", `invalid_token`);

		expect(res.status).toBe(401);
	});

	it("should get an error if authorization header is missing", async () => {
		const res = await test_server.get(Endpoints.AuthGetStore);

		expect(res.status).toBe(401);
	});
});

describe("GET /api/auth/waiter", () => {});
