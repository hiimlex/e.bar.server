import { throw_error } from "@utils/throw_error";
import { Request, Response } from "express";
import { CategoriesModel } from "./categories.model";
import { HttpException } from "@core/server";

class CategoriesRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			const categories = await CategoriesModel.find();

			return res.status(200).json({ content: categories });
		} catch (error) {
			return throw_error(res, error);
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
			return throw_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;

			const category = await CategoriesModel.create(body);

			return res.status(201).json(category);
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			const body = req.body;
			const id = req.params.id;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const category = await CategoriesModel.findOneAndUpdate(
				{ _id: id },
				body,
				{ new: true }
			);

			if (!category) {
				throw new HttpException(404, "CATEGORY_NOT_FOUND");
			}

			return res.status(201).json(category);
		} catch (error) {
			return throw_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			const id = req.params.id;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const category = await CategoriesModel.findByIdAndDelete(id);

			return res.status(204).json(null);
		} catch (error) {
			return throw_error(res, error);
		}
	}
}

export default new CategoriesRepository();
