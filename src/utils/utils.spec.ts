import { DEFAULT_SERVER_ERROR } from "types";
import { get_error_from_test } from "./get_error_from_test";

import { HttpException } from "@core/server";
import { Request, Response } from "express";
import { mock_request, mock_response } from "mocks";
import { get_bearer_token } from "./get_bearer_token";
import { handle_error } from "./handle_error";

describe("get_error_from_test function", () => {
	it("should return 500 error", () => {
		const result = get_error_from_test(false);

		expect(result.statusCode).toBe(DEFAULT_SERVER_ERROR.statusCode);
		expect(result.message).toBe(DEFAULT_SERVER_ERROR.message);
	});
});

describe("handle_error function", () => {
	let res: Response;

	beforeEach(() => {
		res = mock_response();

		res.status = jest.fn().mockReturnThis();
		res.json = jest.fn().mockReturnThis();
		jest.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		// Clear mocks after each test
		jest.clearAllMocks();
	});

	it("should handle HttpException and return the correct status and message", () => {
		const error = new HttpException(404, "USER_NOT_FOUND");

		handle_error(res, error);

		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.json).toHaveBeenCalledWith({ message: "USER_NOT_FOUND" });
		expect(console.log).toHaveBeenCalledWith(
			"**ERROR**: [404] : USER_NOT_FOUND"
		);
	});

	it("should handle generic error and return status 400 with message", () => {
		const error = new Error("Something went wrong");

		handle_error(res, error);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong" });
		expect(console.log).toHaveBeenCalledWith("**ERROR**: Something went wrong");
	});

	it("should handle an error with no message and return status 400", () => {
		const error = {};

		handle_error(res, error);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ message: "" });
		expect(console.log).toHaveBeenCalledWith("**ERROR**: ");
	});
});

describe("get_bearer_token function", () => {
	let req: Request;

	beforeEach(() => {
		req = mock_request();

		jest.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		// Clear mocks after each test
		jest.clearAllMocks();
	});

	it("should get the bearer token from the request", () => {
		req = mock_request({ headers: { authorization: "Bearer token" } });

		const result = get_bearer_token(req);

		expect(result).toBe("token");
	});

	it("should return null if there is no authorization header", () => {
		const result = get_bearer_token(req);

		expect(result).toBeNull();
	});

	it("should return empty string if the authorization header is empty", () => {
		req = mock_request({
			headers: {
				authorization: "",
			},
		});

		const result = get_bearer_token(req);

		expect(result).toBeNull();
	});
});
