import { DEFAULT_CODE_LEN } from "types";

export function generate_random_code(len = DEFAULT_CODE_LEN): string {
	const length = len;
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	let result = "";
	for (let i = length; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}
