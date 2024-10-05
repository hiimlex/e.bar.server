import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { CategoriesModel } from "./categories.schema";
import { HttpException } from "@core/server";
import { IStoreDocument } from "..";
import { IListCategoriesFilters, TCategory } from "types";
import { RootFilterQuery } from "mongoose";

class CategoriesRepository {
	async list(
		req: Request<any, any, any, IListCategoriesFilters>,
		res: Response
	): Promise<Response<any>> {
		try {
			const { store_id } = req.query;

			const query: RootFilterQuery<TCategory> = {};

			if (store_id) {
				query.store = store_id;
			}

			const categories = await CategoriesModel.find(query);

			return res.status(200).json({ content: categories });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_by_store_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store_id = req.params.store_id;

			if (!store_id) {
				throw new HttpException(400, "STORE_NOT_FOUND");
			}

			const categories = await CategoriesModel.find({ store_id });

			return res.status(200).json(categories);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const body = req.body;

			const category = await CategoriesModel.create({
				...body,
				store: store._id,
			});

			return res.status(201).json(category);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;
			const id = req.params.id;
			const store: IStoreDocument = res.locals.store;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			let category = await CategoriesModel.findOne({ _id: id });

			if (!category) {
				throw new HttpException(404, "CATEGORY_NOT_FOUND");
			}

			if (category.store.toString() !== store._id.toString()) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			await category.updateOne({ ...body }, { new: true });
			category = await CategoriesModel.findOne({ _id: id });

			return res.status(201).json(category);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			const id = req.params.id;
			const store: IStoreDocument = res.locals.store;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const category = await CategoriesModel.findOne({ _id: id });

			if (!category) {
				throw new HttpException(404, "CATEGORY_NOT_FOUND");
			}

			if (category.store.toString() !== store._id.toString()) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			await category.deleteOne();

			return res.status(204).json(null);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const CategoriesRepositoryImpl = new CategoriesRepository();

export { CategoriesRepositoryImpl };
