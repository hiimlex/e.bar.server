import { SystemErrors, TSystemErrors } from "types";

export class HttpException extends Error {
	message!: string;
	status: number;

	constructor(status: number, message: TSystemErrors) {
		super();

		if (SystemErrors[message]) {
			super.message = SystemErrors[message];
		}

		this.message = message;
		this.status = status;
	}
}
