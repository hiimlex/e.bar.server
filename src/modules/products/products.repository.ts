import { throw_error } from "@utils/throw_error";
import { Request, Response } from "express";

class ProductsRepository {
	async list(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}
	
	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return throw_error(res, error);
		}
	}
}

export default new ProductsRepository();