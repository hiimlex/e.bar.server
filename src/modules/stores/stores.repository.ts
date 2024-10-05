import { handle_error } from "@utils";
import { Request, Response } from "express";
import { IStoreDocument, StoresModel, TStore } from "./stores.model";
import { IPaginationResponse, SALT_ROUNDS, SystemErrors } from "types";
import { HttpException } from "@core/server";
import { hash } from "bcrypt";

class StoresRepository {
	async list(
		req: Request,
		res: Response
	): Promise<Response<IPaginationResponse<TStore>>> {
		try {
			const stores = await StoresModel.find().collation({ locale: "en" });

			return res.status(200).json({ content: stores });
		} catch (error: any) {
			return handle_error(res, error);
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
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const { password, ...rest } = req.body;

			const hash_password = await hash(password, SALT_ROUNDS);

			const store = await StoresModel.create({
				...rest,
				password: hash_password,
			});

			if (!store) {
				throw new HttpException(400, "STORE_NOT_CREATED");
			}

			return res.status(201).json(store);
		} catch (error: any) {
			return handle_error(res, error);
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
			return handle_error(res, error);
		}
	}

	async update_self(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;

			const store: IStoreDocument = res.locals.store;

			const store_id = store._id;

			if (!store_id) {
				throw new HttpException(400, "STORE_NOT_FOUND");
			}

			const store_updated = await StoresModel.findOneAndUpdate(
				{ _id: store_id },
				body,
				{
					new: true,
				}
			);

			return res.status(201).json(store_updated);
		} catch (error: any) {
			return handle_error(res, error);
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
			return handle_error(res, error);
		}
	}

	async list_products(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error: any) {
			return handle_error(res, error);
		}
	}

	async profile(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;

			return res.status(200).json(store);
		} catch (error: any) {
			return handle_error(res, error);
		}
	}
}

const StoresRepositoryImpl = new StoresRepository();

export { StoresRepositoryImpl };
