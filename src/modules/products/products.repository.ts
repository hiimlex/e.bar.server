import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { ProductsModel } from "./products.model";

class ProductsRepository {
	async list(req: Request, res: Response): Promise<Response<null>> {
		try {
			const products = await ProductsModel.find();

			return res.status(200).json({ content: products });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<null>> {
		try {
			const { id } = req.params;

			const product = await ProductsModel.findById(id);

			if (!product) {
				throw new Error();
			}

			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<null>> {
		try {
			const store = res.locals.store;

			const payload = req.body;

			const new_product = await ProductsModel.create({
				...payload,
				store: store._id,
			});

			return res.status(201).json(new_product);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

export default new ProductsRepository();
