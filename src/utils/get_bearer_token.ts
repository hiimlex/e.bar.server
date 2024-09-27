import { Request } from "express";

export function get_bearer_token(req: Request): string | null {
	if (!req.headers) {
		return null;
	}

	const auth_header = req.headers.authorization || null;

	if (!auth_header) {
		return null;
	}

	const token = auth_header.split(" ")[1];

	if (!token) {
		return null;
	}

	return token;
}
