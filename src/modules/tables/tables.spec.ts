import { create_mock_store, create_mock_table } from "mocks";
import { server } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { Endpoints } from "types";
import { TStore } from "@modules/stores";

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

describe("GET /api/tables", () => {
	it("should return table list", async () => {
		const { body, statusCode } = await test_server
			.get(Endpoints.TableList)
			.set("Authorization", `Bearer ${access_token}`);

		expect(statusCode).toBe(200);
		expect(body).toHaveProperty("content");
	});
});

describe("POST /api/tables", () => {
	it("should return created table", async () => {
		const mock_table = create_mock_table();
		const { body: c_table, statusCode } = await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_table);

		expect(statusCode).toBe(201);
		expect(c_table).toHaveProperty("_id");
	});
});

describe("PUT /api/tables/:id", () => {
	it("should update a table property", async () => {
		const mock_table = create_mock_table();
		const { body: c_table } = await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_table);

		const { body, statusCode } = await test_server
			.put(Endpoints.TableUpdate.replace(":id", c_table._id))
			.set("Authorization", `Bearer ${access_token}`)
			.send({ enabled: false });

		expect(statusCode).toBe(201);
		expect(body.enabled).toBe(false);
	});
});

describe("DELETE /api/tables/:id", () => {
	it("should delete a table by id", async () => {
		const mock_table = create_mock_table();
		const { body: c_table } = await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_table);

		const { statusCode } = await test_server
			.delete(Endpoints.TableDelete.replace(":id", c_table._id))
			.set("Authorization", `Bearer ${access_token}`);

		expect(statusCode).toBe(204);
	});
});
