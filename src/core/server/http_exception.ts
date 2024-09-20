import { SystemErrors, TSystemErrors } from "src/@types";
import { measureMemory } from "vm";

export class HttpException extends Error {
	constructor(public status: number, public message: TSystemErrors | (string & {})) {
		if (SystemErrors[message as any]) {
			message = SystemErrors[message as any];
		}

		super(message);
	}
}
