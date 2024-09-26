import { Request } from "express";

export function get_bearer_token(req: Request): string | null {
	const auth_header = req.headers.authorization;

	if (!auth_header) {
		return null;
	}

	const token = auth_header.split(" ")[1];

	return token;
}