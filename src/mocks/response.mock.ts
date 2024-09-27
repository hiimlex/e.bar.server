import { Response } from "express";

export const mock_response = (opt?: Partial<Response>) => {
	let res = {} as Partial<Response>;

	if (opt) {
		res = { ...resizeTo, ...opt };
	}

	return res as Response;
};
