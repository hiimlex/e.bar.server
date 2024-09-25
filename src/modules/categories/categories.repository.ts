import { throw_error } from "@utils/throw_error";
import { Request, Response } from "express";

class CategoriesRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}
}

export default new CategoriesRepository();
