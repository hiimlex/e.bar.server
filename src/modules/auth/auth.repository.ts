import { HttpException } from "@core/server";
import { throw_error } from "@utils/throw_error";
import { Request, Response } from "express";

class AuthRepository {
	async login(req: Request, res: Response): Promise<Response<void>> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			return res.status(200).json({ email, password });
		} catch (error) {
			return throw_error(error, res);
		}
	}
}

export default new AuthRepository();
