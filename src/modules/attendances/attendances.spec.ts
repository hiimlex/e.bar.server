import { TStore } from "@modules/stores";
import { server, test_agent } from "app";
import {
	create_mock_attendance,
	create_mock_store,
	create_mock_waiter,
} from "mocks";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import {
	ATTENDANCE_COOKIE_NAME,
	Collections,
	Endpoints,
	SystemErrors,
	TAttendanceStatus,
} from "types";

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

afterEach(async () => {
	const collections = mongoose.connection.collections;
	const attendance_collection = collections[Collections.Attendances];
	if (attendance_collection) {
		await attendance_collection.deleteMany({});
	}
});

describe("GET /api/attendances", () => {
	it("should return store attendances", async () => {
		const res = await test_server
			.get(Endpoints.AttendanceList)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("content");
	});
});

describe("GET /api/attendances/:id", () => {
	it("should return a store attendance by id", async () => {
		const mock_attendance = create_mock_attendance();
		const { body } = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		const { _id } = body;

		const res = await test_server
			.get(Endpoints.AttendanceListById.replace(":id", _id))
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("store");
		expect(res.body).toHaveProperty("started_at");
		expect(res.body).toHaveProperty("status");
	});
});

describe("GET /api/attendances/code/:code", () => {
	it("should return a store attendance by code", async () => {
		const mock_attendance = create_mock_attendance();
		const { body } = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		const { code } = body;

		const mock_waiter = create_mock_waiter();
		await test_server
			.post(Endpoints.WaiterCreate)
			.send(mock_waiter)
			.set("Authorization", `Bearer ${access_token}`);

		const {
			body: { access_token: waiter_access_token },
		} = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_waiter.email,
			password: mock_waiter.password,
		});

		const res = await test_server
			.get(Endpoints.AttendanceGetByCode.replace(":code", code))
			.set("Authorization", `Bearer ${waiter_access_token}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("store");
		expect(res.body).toHaveProperty("started_at");
		expect(res.body).toHaveProperty("status");
	});
});

describe("POST /api/attendances", () => {
	it("should create a store attendance", async () => {
		const mock_attendance = create_mock_attendance();
		const res = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("store");
		expect(res.body).toHaveProperty("started_at");
		expect(res.body).toHaveProperty("status");
	});

	it("should return error if store already has an active attendance", async () => {
		const mock_attendance = create_mock_attendance({
			status: TAttendanceStatus.OPEN,
		});
		await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		const another_mock_attendance = create_mock_attendance();
		const res = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(another_mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty("message");
		expect(res.body.message).toBe(
			SystemErrors.STORE_ALREADY_HAS_AN_ACTIVE_ATTENDANCE
		);
	});
});

describe("PUT /api/attendances", () => {
	it("should update a store attendance", async () => {
		const mock_attendance = create_mock_attendance();
		const { body } = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		const { _id } = body;

		const res = await test_server
			.put(Endpoints.AttendanceUpdate.replace(":id", _id))
			.send({ status: TAttendanceStatus.CLOSED })
			.set("Authorization", `Bearer ${access_token}`);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("_id");
		expect(res.body).toHaveProperty("store");
		expect(res.body).toHaveProperty("started_at");
		expect(res.body).toHaveProperty("status");
		expect(res.body.status).toBe(TAttendanceStatus.CLOSED);
	});
});

describe("POST /api/attendance/validate/:code", () => {
	it("should waiter validate an attendance code", async () => {
		const mock_attendance = create_mock_attendance();
		const { body: c_attendance } = await test_server
			.post(Endpoints.AttendanceCreate)
			.send(mock_attendance)
			.set("Authorization", `Bearer ${access_token}`);

		const mock_waiter = create_mock_waiter();
		await test_server
			.post(Endpoints.WaiterCreate)
			.send(mock_waiter)
			.set("Authorization", `Bearer ${access_token}`);

		const {
			body: { access_token: waiter_access_token },
		} = await test_server.post(Endpoints.AuthLogin).send({
			email: mock_waiter.email,
			password: mock_waiter.password,
		});

		const { code } = c_attendance;

		const res = await test_server
			.post(Endpoints.AttendanceValidateCode.replace(":code", code))
			.set("Authorization", `Bearer ${waiter_access_token}`);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("_id");
	});
});
