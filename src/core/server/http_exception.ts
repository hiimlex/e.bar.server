import { SystemErrors, TSystemErrors } from "types";

export class HttpException extends Error {
	message!: string;
	status: number;

	constructor(status: number, message: TSystemErrors | (string & {})) {
		super();

		if (SystemErrors[message as any]) {
			super.message = SystemErrors[message as any];
		}

		this.message = message;
		this.status = status;
	}
}
