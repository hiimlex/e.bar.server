import { test_agent } from "app";
import { Request, Response } from "express";
import {
	create_mock_product,
	create_mock_store,
	mock_request,
	mock_response,
} from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import { Endpoints } from "types";
import { TStore } from "../stores";
import { ProductsRepositoryImpl } from "./products.repository";

const test_server = test_agent;
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

		const res = await test_server
			.get(Endpoints.ProductList)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("content");
	});

	it("should get all products by store id", async () => {
		const mock_product = create_mock_product();
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server
			.get(Endpoints.ProductList)
			.set("Authorization", `Bearer ${access_token}`)
			.query({ store_id: created_store._id });

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("content");
	});

	it("should filter for empty stock products", async () => {
		const mock_product = create_mock_product({ stock: 0 });
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server
			.get(Endpoints.ProductList)
			.set("Authorization", `Bearer ${access_token}`)
			.query({ no_stock: true });

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("content");
		expect(res.body.content.length).toBeGreaterThan(0);
	});

	it("should filter by name", async () => {
		const mock_product = create_mock_product({ name: "mock_product" });
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server
			.get(Endpoints.ProductList)
			.set("Authorization", `Bearer ${access_token}`)
			.query({ name: mock_product.name });

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("content");
		expect(res.body.content.length).toBeGreaterThan(0);
	});

	it("should filter by category", async () => {
		const mock_product = create_mock_product({
			category: new Types.ObjectId(),
		});
		const { body: c_product } = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server
			.get(Endpoints.ProductList)
			.set("Authorization", `Bearer ${access_token}`)
			.query({ category_id: c_product.category });

		expect(res.statusCode).toBe(200);
		expect(res.body).toBeTruthy();
		expect(res.body).toHaveProperty("content");
		expect(res.body.content.length).toBeGreaterThan(0);
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

describe(`PUT /api/products/:id`, () => {
	it("should update a product", async () => {
		const mock_product = create_mock_product();
		const c_product = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const new_mock = create_mock_product();
		const res = await test_server
			.put(Endpoints.ProductUpdate.replace(":id", c_product.body._id))
			.set("Authorization", `Bearer ${access_token}`)
			.send(new_mock);

		expect(res.statusCode).toBe(201);
		expect(res.body).toBeTruthy();
		expect(res.body.name).toBe(new_mock.name);
	});

	it("should return error if id is not provided", async () => {
		const res = await test_server
			.put(Endpoints.ProductUpdate)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body).toBeTruthy();
	});

	it("should return error if product is not from store", async () => {
		const another_mock_store = create_mock_store();
		const another_c_store = await test_server
			.post(Endpoints.StoreCreate)
			.send(another_mock_store);

		const another_access_token = (
			await test_server.post(Endpoints.AuthLogin).send({
				email: another_mock_store.email,
				password: another_mock_store.password,
			})
		).body.access_token;

		const mock_product = create_mock_product();
		const c_product = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const new_mock = create_mock_product();
		const res = await test_server
			.put(Endpoints.ProductUpdate.replace(":id", c_product.body._id))
			.set("Authorization", `Bearer ${another_access_token}`)
			.send(new_mock);

		expect(res.statusCode).toBe(403);
	});

	it("should return error if product is not found", async () => {
		const new_mock = create_mock_product();
		const res = await test_server
			.put(Endpoints.ProductUpdate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(new_mock);

		const is400or404 = res.statusCode === 400 || res.statusCode === 404;

		expect(is400or404).toBeTruthy();
	});

	it("should return error if store is not authenticated", async () => {
		const new_mock = create_mock_product();
		const res = await test_server.put(Endpoints.ProductUpdate).send(new_mock);

		const is400or404 = res.statusCode === 403 || res.statusCode === 401;

		expect(is400or404).toBeTruthy();
	});
});

describe("DELETE /api/products/:id", () => {
	it("should delete a product", async () => {
		const mock_product = create_mock_product();
		const c_product = await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_product);

		const res = await test_server
			.delete(Endpoints.ProductDelete.replace(":id", c_product.body._id))
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.statusCode).toBe(204);
	});

	it("should return error if product is not found", async () => {
		const res = await test_server
			.delete(Endpoints.ProductDelete.replace(":id", "123"))
			.set("Authorization", `Bearer ${access_token}`);

		const is400or404 = res.statusCode === 400 || res.statusCode === 404;

		expect(is400or404).toBeTruthy();
	});

	it("should return error if id is not provided", async () => {
		const res = await test_server
			.delete(Endpoints.ProductDelete)
			.set("Authorization", `Bearer ${access_token}`);

		const is400or404 = res.statusCode === 400 || res.statusCode === 404;

		expect(is400or404).toBeTruthy();
	});

	it("should return error if store is not authenticated", async () => {
		const res = await test_server.delete(Endpoints.ProductDelete);

		const is400or404 = res.statusCode === 401 || res.statusCode === 403;

		expect(is400or404).toBeTruthy();
	});
});

describe("ProductsRepositoryImpl class", () => {
	let res: Response;
	let req: Request;

	afterEach(() => {
		jest.clearAllMocks();
	});

	beforeEach(() => {
		res = mock_response();
		req = mock_request();
		res.status = jest.fn().mockReturnThis();
		res.json = jest.fn().mockReturnThis();
	});

	describe("list", () => {
		it("should return 200 with a list of products", async () => {
			req = mock_request({
				headers: {
					authorization: `Bearer ${access_token}`,
				},
				query: {},
			});

			await ProductsRepositoryImpl.list(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalled();
		});
	});

	describe("create", () => {
		it("should return 201 with a new product", async () => {
			req = mock_request({
				body: create_mock_product(),
				headers: {
					authorization: `Bearer ${access_token}`,
				},
			});
			res.locals = { store: created_store };

			await ProductsRepositoryImpl.create(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalled();
		});

		it("should return 400 if name is not provided", async () => {
			req.body = create_mock_product();
			req.body.name = undefined;
			await ProductsRepositoryImpl.create(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalled();
		});
	});

	describe("update", () => {
		it("should return 200 with a product", async () => {
			const mock_product = create_mock_product();
			const c_product = await test_server
				.post(Endpoints.ProductCreate)
				.set("Authorization", `Bearer ${access_token}`)
				.send(mock_product);

			req.params = { id: c_product.body._id };
			const new_mock = create_mock_product();
			req.body = new_mock;
			res.locals = { store: created_store };

			await ProductsRepositoryImpl.update(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalled();
		});
	});

	describe("list_by_id", () => {
		it("should return 200 with a product", async () => {
			const mock_product = create_mock_product();
			const c_product = await test_server
				.post(Endpoints.ProductCreate)
				.set("Authorization", `Bearer ${access_token}`)
				.send(mock_product);

			req.params = { id: c_product.body._id };

			await ProductsRepositoryImpl.list_by_id(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		it("should delete a product", async () => {
			const mock_product = create_mock_product();
			const c_product = await test_server
				.post(Endpoints.ProductCreate)
				.set("Authorization", `Bearer ${access_token}`)
				.send(mock_product);

			req.params = { id: c_product.body._id };
			res.locals = { store: created_store };

			await ProductsRepositoryImpl.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(204);
		});

		it("should return error if id is not provided", async () => {
			await ProductsRepositoryImpl.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should return error if product is not found", async () => {
			req.params = { id: "123" };

			await ProductsRepositoryImpl.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});
	});
});
