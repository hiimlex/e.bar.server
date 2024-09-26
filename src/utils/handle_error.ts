import { HttpException } from "@core/server";
import { Response } from "express";

export function handle_error(res: Response, error: any): Response {
	const message: string = error.message || "";

	if (error instanceof HttpException) {
		console.log(`**ERROR**: [${error.status}] : ${error.message}`);
		return res.status(error.status).json({ message });
	}

	console.log(`**ERROR**: ${message}`);

	return res.status(400).json({ message });
}
