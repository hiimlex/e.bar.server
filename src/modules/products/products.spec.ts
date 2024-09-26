import { server } from "app";
import { create_mock_product, create_mock_store } from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import st from "supertest";
import { Endpoints } from "types";
import { TStore } from "..";

const test_server = st(server.app);
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

describe(`POST /api/products/`, () => {
	it("should create a product", async () => {
		const mock_product = create_mock_product();
		const res = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		expect(res.statusCode).toBe(201);

		expect(res.body).toBeTruthy();
	});

	it("should return an error if name is not provided", async () => {
		const mock_product = create_mock_product();
		const res = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send({ ...mock_product, name: undefined });

		if (res.error) {
			expect(
				(JSON.parse(res.error.text).message as string).toLocaleLowerCase()
			).toContain("name");
		}

		expect(res.statusCode).toBe(400);
	});
});

describe(`GET /api/products/`, () => {
	it("should get all products", async () => {
		const mock_product = create_mock_product();
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server.get(Endpoints.ProductList);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});
});

describe(`GET /api/products/:id`, () => {
	it("should get an product by id", async () => {
		const mock_product = create_mock_product();
		const product_res = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		expect(product_res.body).toBeTruthy();

		const c_product = product_res.body;

		const res = await test_server.get(
			Endpoints.ProductListById.replace(":id", c_product._id.toString())
		);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
	});
});
