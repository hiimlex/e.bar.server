import { DEFAULT_SERVER_ERROR, HTTPError } from "types";

export function get_error_from_test(error: false | HTTPError): {
	statusCode: number;
	message: string;
} {
	if (!error) {
		return DEFAULT_SERVER_ERROR;
	}

	return JSON.parse(error.text).message;
}
