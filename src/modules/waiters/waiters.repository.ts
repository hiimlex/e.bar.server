import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";

class WaitersRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async profile(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const WaitersRepositoryImpl = new WaitersRepository();

export { WaitersRepositoryImpl };
