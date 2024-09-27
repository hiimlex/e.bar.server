import { Request } from "express";

export const mock_request = (opt?: Partial<Request>): Request => {
	let req = {} as Partial<Request>;
	if (opt) {
		req = { ...opt };
	}
	return req as Request;
};
