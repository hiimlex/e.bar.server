import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";

class StoreOrdersRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async show_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async cancel(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async finish(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const StoreOrdersRepositoryImpl = new StoreOrdersRepository();

export { StoreOrdersRepositoryImpl };
