import { HttpException } from "@core/server";
import { IStoreDocument } from "@modules/stores";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { RootFilterQuery } from "mongoose";
import { IListProductsFilters, TProduct } from "types";
import { TUploadedFile } from "types/files.model";
import { TFile } from "../cloudinary";
import { ProductsModel } from "./products.schema";

class ProductsRepository {
	async list(
		req: Request<any, any, any, IListProductsFilters>,
		res: Response
	): Promise<Response<null>> {
		try {
			const {
				store_id,
				category_id,
				sort,
				sort_by,
				name,
				no_stock,
				limit,
				offset,
				page,
			} = req.query;


			const query: RootFilterQuery<TProduct> = {};

			if (store_id) {
				query.store = store_id;
			}

			if (category_id) {
				query.category = category_id;
			}

			if (name) {
				query.name = { $regex: name, $options: "i" };
			}

			if (no_stock) {
				query.stock = { $eq: 0 };
			}

			let sort_config: any;
			if (sort_by && sort) {
				sort_config = { [sort_by.toString()]: sort };
			}

			const products = await ProductsModel.find(query, null, {
				sort: sort_config,
			}).collation({ locale: "en" });

			for (const product of products) {
				await product.populate_all();
			}

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

			const product = await ProductsModel.findOneAndDelete({
				_id: id,
				store: store._id,
			});

			if (!product) {
				throw new HttpException(404, "PRODUCT_NOT_FOUND");
			}

			return res.status(204).json(null);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const ProductsRepositoryImpl = new ProductsRepository();

export { ProductsRepositoryImpl };
