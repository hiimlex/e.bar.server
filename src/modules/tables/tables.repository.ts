import { handle_error } from "@utils/handle_error";
import { Response, Request } from "express";
import { TablesModel } from "./tables.model";
import { IStoreDocument } from "@modules/stores";
import { HttpException } from "@core/server";

class TablesRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const tables = await TablesModel.find({ store: store._id });

			return res.status(200).json({ content: tables });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const payload = req.body;

			const last_table = await TablesModel.findOne({ store: store._id }).sort({
				number: -1,
			});

			const last_number = last_table ? last_table.number + 1 : 1;

			const table = await TablesModel.create({
				...payload,
				number: last_number,
				store: store._id,
			});

			return res.status(201).json(table);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const payload = req.body;
			const id = req.params.id;

			const table = await TablesModel.findOne({
				_id: id,
				store: store._id,
			});

			if (!table) {
				throw new HttpException(400, "TABLE_NOT_FOUND");
			}

			if (!table.store.equals(store._id)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			await table.updateOne(payload);

			const updated_table = await TablesModel.findOne({
				_id: id,
				store: store._id,
			});

			return res.status(201).json(updated_table);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const id = req.params.id;

			const table = await TablesModel.findOne({
				_id: id,
				store: store._id,
			});

			if (!table) {
				throw new HttpException(400, "TABLE_NOT_FOUND");
			}

			if (!table.store.equals(store._id)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			await table.deleteOne();

			return res.status(204).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async set_in_use(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.status(200).json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const TablesRepositoryImpl = new TablesRepository();

export { TablesRepositoryImpl };
