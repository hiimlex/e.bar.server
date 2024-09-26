import { HTTPError } from "types/index";

export function get_error_from_test(error: false | HTTPError): {
	statusCode: number;
	message: string;
} {
	if (!error) {
		return {
			statusCode: 500,
			message: "An error occurred",
		};
	}

	return JSON.parse(error.text).message;
}
