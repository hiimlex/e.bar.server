import { TAttendance, TProduct, TStore, TTable, TWaiter } from "@modules";
import { test_agent } from "app";
import {
	create_mock_attendance,
	create_mock_product,
	create_mock_store,
	create_mock_table,
	create_mock_waiter,
} from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import { Endpoints } from "types";
import { OrderStatus, TOrder } from "./orders.model";

const test_server = test_agent;
let mongo_server: MongoMemoryServer;
let mock_store: TStore = create_mock_store();
let created_store: TStore;
let access_token: string;
let c_waiter: TWaiter;
let waiter_access_token: string;
let c_attendance: TAttendance;
let cookie = "";
let c_table: TTable;
let c_product: TProduct;

const mock_waiter = create_mock_waiter();

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

	const { body } = await test_server
		.post(Endpoints.WaiterCreate)
		.set("Authorization", `Bearer ${access_token}`)
		.send(mock_waiter);

	c_waiter = body;

	const { body: waiter_login } = await test_server
		.post(Endpoints.AuthLogin)
		.send({
			email: mock_waiter.email,
			password: mock_waiter.password,
		});

	waiter_access_token = waiter_login.access_token;

	const { body: attendance } = await test_server
		.post(Endpoints.AttendanceCreate)
		.set("Authorization", `Bearer ${access_token}`)
		.send(create_mock_attendance({ tables_count: 4 }));

	c_attendance = attendance;

	const res = await test_server
		.post(Endpoints.AttendanceValidateCode.replace(":code", c_attendance.code))
		.set("Authorization", `Bearer ${waiter_access_token}`);

	cookie = res.headers["set-cookie"];

	c_table = (
		await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(create_mock_table())
	).body;

	c_product = (
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(create_mock_product())
	).body;
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

describe("GET /api/w-orders", () => {
	it("should return store waiter orders", async () => {
		const res = await test_server
			.get(Endpoints.WaiterOrderList)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("content");
	});
});

describe("POST /api/w-orders", () => {
	it("should create and return an order", async () => {
		const mock_table = create_mock_table();
		const { body: c_table } = await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_table);

		const res = await test_server
			.post(Endpoints.WaiterOrderCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie)
			.send({
				table: c_table._id,
				customers: 4,
			});

		expect(res.status).toBe(201);
		expect(res.body).toMatchObject<TOrder>({
			store: created_store._id,
			_id: expect.any(String),
			attendance: c_attendance._id,
			customers: 4,
			table: c_table._id,
			number: 1,
			status: OrderStatus.PENDING,
			requested_by: c_waiter._id,
		});
	});
});

describe("GET /api/w-orders/:id", () => {
	it("should return order by id", async () => {
		const mock_table = create_mock_table();
		const { body: c_table } = await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(mock_table);

		const { body: c_order } = await test_server
			.post(Endpoints.WaiterOrderCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie)
			.send({
				table: c_table._id,
				customers: 4,
			});

		const res = await test_server
			.get(Endpoints.WaiterOrderShowById.replace(":id", c_order._id))
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("store");
		expect(res.body.store).toBe(created_store._id);
	});
});

describe("PUT /api/w-orders/cancel/:id", () => {
	it("should waiter cancel an order", async () => {
		const { body: c_order } = await test_server
			.post(Endpoints.WaiterOrderCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie)
			.send({
				table: c_table._id,
				customers: 4,
			});

		const res = await test_server
			.put(Endpoints.WaiterOrderCancel.replace(":id", c_order._id))
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("status");
	});
});

describe("PUT /api/w-orders/:id", () => {
	it("should add an item to an order", async () => {
		const { body: c_order } = await test_server
			.post(Endpoints.WaiterOrderCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie)
			.send({
				table: c_table._id,
				customers: 4,
			});

		const res = await test_server
			.put(Endpoints.WaiterOrderUpdate.replace(":id", c_order._id))
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.set("Cookie", cookie)
			.send({
				items: [
					{
						product_id: c_product._id,
						quantity: 2,
					},
				],
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("_id");
	});
});
