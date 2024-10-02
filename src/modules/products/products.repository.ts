import { HttpException } from "@core/server";
import { IStoreDocument } from "@modules/stores";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { TUploadedFile } from "types/files";
import { TFile } from "../cloudinary";
import { ProductsModel } from "./products.model";
import { Collections } from "types";

class ProductsRepository {
	async list(req: Request, res: Response): Promise<Response<null>> {
		try {
			const products = await ProductsModel.aggregate([
				{
					$lookup: {
						from: Collections.Categories,
						localField: "category",
						foreignField: "_id",
						as: "category_info",
					},
				},
				{
					$unwind: "$category_info",
				},
				{
					$addFields: {
						category_name: "$category_info.name",
					},
				},
				{
					$project: {
						category_info: 0,
					},
				},
			]);

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
			const file = req.file as TUploadedFile;
			const payload = req.body;

			if (file) {
				const picture: TFile = {
					url: file.path,
					original_name: file.originalname,
				};

				payload.picture = picture;
			}

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
			const store: IStoreDocument = res.locals.store;
			const { id } = req.params;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const product = await ProductsModel.findById(id);

			if (!product) {
				throw new HttpException(404, "PRODUCT_NOT_FOUND");
			}

			if (!product.store.equals(store._id)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			const payload = req.body;

			await product.updateOne(payload);

			const updated_product = await ProductsModel.findById(id);

			return res.status(201).json(updated_product);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const { id } = req.params;

			if (!id) {
				throw new HttpException(400, "ID_NOT_PROVIDED");
			}

			const product = await ProductsModel.findById(id);

			if (!product) {
				throw new HttpException(404, "PRODUCT_NOT_FOUND");
			}

			if (!product.store.equals(store._id)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			await product.deleteOne();

			return res.status(204).json(null);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const ProductsRepositoryImpl = new ProductsRepository();

export { ProductsRepositoryImpl };
