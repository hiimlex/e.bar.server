import { throw_error } from "@utils";
import { Request, Response } from "express";
import { StoresModel, TStore } from "./stores.model";
import { IPaginationResponse, SystemErrors } from "@types";
import { HttpException } from "@core/server";

class StoresRepository {
	async list(
		req: Request,
		res: Response
	): Promise<Response<IPaginationResponse<TStore>>> {
		try {
			const stores = await StoresModel.find();

			return res.status(200).json({ content: stores });
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			const id = req.params.id;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const store = await StoresModel.findById(id);

			if (!store) {
				throw new HttpException(400, "STORE_NOT_FOUND");
			}

			return res.status(200).json(store);
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;

			const store = await StoresModel.create(body);

			return res.status(201).json(store);
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;

			const id = req.params.id;

			if (!id) {
				throw new HttpException(400, "STORE_NOT_FOUND");
			}

			const store = await StoresModel.findOneAndUpdate({ _id: id }, body, {
				new: true,
			});

			return res.status(201).json(store);
		} catch (error: any) {
			return throw_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			const id = req.params.id;

			if (!id) {
				throw new HttpException(400, "STORE_NOT_FOUND");
			}

			await StoresModel.findByIdAndDelete(id);

			return res.status(204).json(null);
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

export default new StoresRepository();
