import { throw_error } from "@utils/throw_error";
import { Request, Response } from "express";
import { StoreModel, TStore } from "./store.model";
import { IPaginationResponse } from "src/@types";

class StoreRepository {
	async list(
		req: Request,
		res: Response
	): Promise<Response<IPaginationResponse<TStore>>> {
		try {
			const stores = StoreModel.find();

			return res.status(200).json({ content: stores });
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async list_products(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async profile(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return throw_error(res, error);
		}
	}
}

export default new StoreRepository();
