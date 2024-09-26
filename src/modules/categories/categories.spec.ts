import { server } from "app";
import { create_mock_store, create_mock_category } from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import st from "supertest";
import { Endpoints } from "types";
import { TStore } from "../stores";

let test_server = st(server.app);
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

describe(`POST  ${Endpoints.CategoryCreate}`, () => {
	it("should create a category", async () => {
		const mock_category = create_mock_category();

		const res = await test_server
			.post(Endpoints.CategoryCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ ...mock_category });

		expect(res.statusCode).toBe(201);

		expect(res.body).toBeTruthy();
	});
});

describe(`GET  ${Endpoints.CategoryCreate}`, () => {
	it("should list all categories", async () => {
		const res = await test_server.get(Endpoints.CategoryList);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});
});

describe(`GET  ${Endpoints.CategoryListByStoreId}`, () => {
	it("should list all categories by store id", async () => {
		const res = await test_server.get(
			Endpoints.CategoryListByStoreId.replace(
				":store_id",
				created_store._id.toString()
			)
		);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});
});

describe(`PUT  ${Endpoints.CategoryUpdate}`, () => {
	it("should update a category", async () => {
		const mock_category = create_mock_category();
		const { body: c_category } = await test_server
			.post(Endpoints.CategoryCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ ...mock_category });

		expect(c_category).toBeTruthy();

		const res = await test_server
			.put(
				`${Endpoints.CategoryUpdate.replace(":id", c_category._id.toString())}`
			)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ name: "Updated Category" });

		expect(res.statusCode).toBe(201);
		expect(res.body).toBeTruthy();
		expect(res.body.name).toBe("Updated Category");
	});
});

describe(`DELETE ${Endpoints.CategoryDelete}`, () => {
	it("should delete a category", async () => {
		const mock_category = create_mock_category();
		const { body: c_category } = await test_server
			.post(Endpoints.CategoryCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ ...mock_category });

		expect(c_category).toBeTruthy();

		const res = await test_server
			.delete(
				Endpoints.CategoryDelete.replace(":id", c_category._id.toString())
			)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.statusCode).toBe(204);
	});
});
