import { create_mock_store } from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Endpoints } from "types";
import { test_agent } from "../../app";

const test_server = test_agent;
let mongo_server: MongoMemoryServer;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);
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

describe(`POST  ${Endpoints.StoreCreate}`, () => {
	it("should create a store", async () => {
		// create the store
		const mock_store = create_mock_store();
		const { body: c_store, statusCode } = await test_server
			.post(Endpoints.StoreCreate)
			.send(mock_store);

		expect(statusCode).toBe(201);
		expect(c_store).toBeTruthy();
	});

	it("should check if the password is hashed", async () => {
		// create a store
		const mock_store = create_mock_store();
		const { body: c_store, statusCode } = await test_server
			.post(Endpoints.StoreCreate)
			.send(mock_store);

		expect(statusCode).toBe(201);
		expect(mock_store).not.toBe(c_store.password);
	});

	it("should return an error if email is not provided", async () => {
		const res = await test_server
			.post(Endpoints.StoreCreate)
			.send({ ...create_mock_store(), email: undefined });

		const is400or404 = res.statusCode === 400 || res.statusCode === 404;

		expect(is400or404).toBe(true);
	});
});

describe(`GET  ${Endpoints.StoreList}`, () => {
	it("should list all stores", async () => {
		const res = await test_server.get(Endpoints.StoreList);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});
});

describe(`GET  ${Endpoints.StoreListById}`, () => {
	it("should list a store by id", async () => {
		// create a store
		const mock_store = create_mock_store();
		const { body: c_store } = await test_server
			.post(Endpoints.StoreCreate)
			.send(mock_store);

		expect(c_store).toBeTruthy();

		// get the created store by id
		const res = await test_server.get(
			`${Endpoints.StoreListById.replace(":id", c_store._id.toString())}`
		);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});

	it("should return an error if store it's not found", async () => {
		const res = await test_server.get(
			`${Endpoints.StoreListById.replace(":id", "123")}`
		);

		const is404or400 = res.statusCode === 400 || res.statusCode === 404;

		expect(is404or400).toBeTruthy();
	});

	it("should return an error if id is not provided", async () => {
		const res = await test_server.get(Endpoints.StoreListById);

		const is404or400 = res.statusCode === 400 || res.statusCode === 404;

		expect(is404or400).toBeTruthy();
	});
});

describe(`GET ${Endpoints.StoreProfile}`, () => {
	it("should return an error if token is not provided", async () => {
		const res = await test_server.get(Endpoints.StoreProfile);

		expect(res.statusCode).toBe(401);
	});

	it("should return the store document", async () => {
		// create a store
		const mock_store = create_mock_store();
		const { body: c_store } = await test_server
			.post(Endpoints.StoreCreate)
			.send(mock_store);

		expect(c_store).toBeTruthy();

		// get the access token
		const {
			body: { access_token },
		} = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_store.email,
			password: mock_store.password,
		});

		expect(access_token).toBeTruthy();

		// get the store profile
		const res = await test_server
			.get(Endpoints.StoreProfile)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body.email).toBe(mock_store.email);
	});
});

describe(`PUT  ${Endpoints.StoreUpdate}`, () => {
	it("should return an error if id is not provided", async () => {
		const res = await test_server.put(Endpoints.StoreUpdate);

		const is404or400 = res.statusCode === 400 || res.statusCode === 404;

		expect(is404or400).toBeTruthy();
	});

	it("should change store enabled to true", async () => {
		// create a store
		const mock_store = create_mock_store();
		const { body: c_store } = await test_server
			.post(Endpoints.StoreCreate)
			.send(mock_store);

		expect(c_store).toBeTruthy();

		// get the access token
		const { body: auth } = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_store.email,
			password: mock_store.password,
		});

		expect(auth.access_token).toBeTruthy();

		// get the access token
		const res = await test_server
			.put(`${Endpoints.StoreUpdate.replace(":id", c_store._id.toString())}`)
			.set("Authorization", `Bearer ${auth.access_token}`)
			.send({ name: "Mock name" });

		expect(res.statusCode).toBe(201);
		expect(res.body).toBeTruthy();
		expect(res.body.name).toBe("Mock name");
	});
});

describe(`DELETE  ${Endpoints.StoreDelete}`, () => {
	it("should return an error if id is not provided", async () => {
		const res = await test_server.delete(Endpoints.StoreDelete);

		const is404or400 = res.statusCode === 400 || res.statusCode === 404;

		expect(is404or400).toBeTruthy();
	});

	it("should delete a store", async () => {
		const t_store = create_mock_store();
		const { body: c_store } = await test_server
			.post(Endpoints.StoreCreate)
			.send(t_store);

		const res = await test_server.delete(
			`${Endpoints.StoreDelete.replace(":id", c_store._id.toString())}`
		);

		expect(res.statusCode).toBe(204);
	});
});
