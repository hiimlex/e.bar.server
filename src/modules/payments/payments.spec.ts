import { MongoMemoryServer } from "mongodb-memory-server";
import { test_agent } from "../../app";
import mongoose from "mongoose";
import {
	Endpoints,
	TAttendance,
	TAttendanceStatus,
	TOrder,
	TPaymentMethod,
	TProduct,
	TTable,
	TWaiter,
} from "types";
import { TStore } from "@modules/stores";
import {
	create_mock_attendance,
	create_mock_product,
	create_mock_store,
	create_mock_table,
	create_mock_waiter,
} from "mocks";

let test_server = test_agent;
let mongo_server: MongoMemoryServer;
// Access variables
let access_token: string;
let waiter_access_token: string;
let cookie = "";
// Mocks

let mock_store: TStore = create_mock_store();
// Created entities
let c_store: TStore;
let c_waiter: TWaiter;
let c_attendance: TAttendance;
let c_table: TTable;
let c_product: TProduct;
let c_order: TOrder;

beforeAll(async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}

	mongo_server = await MongoMemoryServer.create();
	const uri = mongo_server.getUri();
	await mongoose.connect(uri);
	// Create store
	c_store = (await test_server.post(Endpoints.StoreCreate).send(mock_store))
		.body;
	// Get store access token
	access_token = (
		await test_server.post(Endpoints.AuthLogin).send({
			email: mock_store.email,
			password: mock_store.password,
		})
	).body.access_token;
	// Create waiter
	const mock_waiter: Partial<TWaiter> = create_mock_waiter({
		store: c_store._id,
	});
	const { body: created_waiter } = await test_server
		.post(Endpoints.WaiterCreate)
		.set("Authorization", `Bearer ${access_token}`)
		.send(mock_waiter);

	c_waiter = created_waiter;
	// Get waiter access token
	const { body: waiter_login } = await test_server
		.post(Endpoints.AuthLogin)
		.send({
			email: mock_waiter.email,
			password: mock_waiter.password,
		});

	waiter_access_token = waiter_login.access_token;
	// Create attendance
	const { body: attendance } = await test_server
		.post(Endpoints.AttendanceCreate)
		.set("Authorization", `Bearer ${access_token}`)
		.send(
			create_mock_attendance({
				tables_count: 4,
				status: TAttendanceStatus.OPEN,
				store: c_store._id,
			})
		);

	c_attendance = attendance;

	// Validate attendance code
	const res = await test_server
		.post(Endpoints.AttendanceValidateCode.replace(":code", c_attendance.code))
		.set("Authorization", `Bearer ${waiter_access_token}`);

	cookie = res.headers["set-cookie"];
	// Create table, product and order
	c_table = (
		await test_server
			.post(Endpoints.TableCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(create_mock_table({ store: c_store._id }))
	).body;

	c_product = (
		await test_server
			.post(Endpoints.ProductCreate)
			.set("Authorization", `Bearer ${access_token}`)
			.send(
				create_mock_product({
					store: c_store._id,
				})
			)
	).body;

	const { body: created_order_body } = await test_server
		.post(Endpoints.WaiterOrderCreate)
		.set("Authorization", `Bearer ${waiter_access_token}`)
		.set("Cookie", cookie)
		.send({
			table_id: c_table._id,
			customers: 4,
		});

	c_order = created_order_body;
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

describe("GET /api/payments", () => {
	it("should return all payments from store", async () => {
		const { body, statusCode } = await test_server
			.get(Endpoints.PaymentList)
			.set("Authorization", `Bearer ${access_token}`);

		expect(body).toBeTruthy();
		expect(statusCode).toBe(200);
	});
});

describe("GET /api/payments/order/:order_id", () => {
	it("should get a payment by order", async () => {
		const { body, statusCode } = await test_server
			.get(
				Endpoints.PaymentShowByOrder.replace(
					":order_id",
					c_order._id.toString()
				)
			)
			.set("Authorization", `Bearer ${access_token}`);

		expect(body).toBeTruthy();
		expect(statusCode).toBe(200);
	});
});

describe("POST /api/payments", () => {
	it("should create a cash payment for an order", async () => {
		const { body: updated_order } = await test_server
			.put(Endpoints.WaiterOrderAddItem.replace(":id", c_order._id.toString()))
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

		c_order = updated_order;

		const { body, statusCode } = await test_server
			.post(Endpoints.PaymentCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.send({
				amount: c_order.total,
				method: TPaymentMethod.Cash,
				cash_config: {
					charge: 0,
				},
				order: c_order._id,
				attendance: c_attendance._id,
				store: c_store._id,
			});

		expect(body).toBeTruthy();
		expect(body.method).toBe(TPaymentMethod.Cash);
		expect(body.cash_config).toBeDefined();
		expect(statusCode).toBe(201);
	});
});

describe("PUT /api/payments/:id", () => {
	it("should update a payment", async () => {
		const { body: payment } = await test_server
			.post(Endpoints.PaymentCreate)
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.send({
				amount: c_order.total,
				method: TPaymentMethod.Cash,
				cash_config: {
					charge: 0,
				},
				order: c_order._id,
				attendance: c_attendance._id,
				store: c_store._id,
			});

		const { body, statusCode } = await test_server
			.put(Endpoints.PaymentUpdate.replace(":id", payment._id))
			.set("Authorization", `Bearer ${waiter_access_token}`)
			.send({
				method: TPaymentMethod.Pix,
				pix_config: {
					name: "João",
				},
			});

		expect(body).toBeTruthy();
		expect(body.method).toBe(TPaymentMethod.Pix);
		expect(body.pix_config).toBeDefined();
		expect(body.cash_config).toBeNull();
		expect(statusCode).toBe(200);
	});
});
