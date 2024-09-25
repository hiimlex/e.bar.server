import { SystemErrors, TSystemErrors } from "@types";

export class HttpException extends Error {
	constructor(
		public status: number,
		public message: TSystemErrors | (string & {})
	) {
		super();

		if (SystemErrors[message as any]) {
			message = SystemErrors[message as any];
		}

		this.message = message;
		this.status = status;

		super(message);
	}
}
