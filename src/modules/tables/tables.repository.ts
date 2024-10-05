import { HttpException } from "@core/server";
import { IStoreDocument } from "@modules/stores";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { RootFilterQuery } from "mongoose";
import { IListTablesFilters, TAttendanceStatus, TTable } from "types";
import { AttendancesModel } from "..";
import { TablesModel } from "./tables.schema";

class TablesRepository {
	async list(
		req: Request<any, any, any, IListTablesFilters>,
		res: Response
	): Promise<Response<any>> {
		try {
			const { sort, sort_by, limit, store_id, is_enabled } = req.query;

			const store: IStoreDocument = res.locals.store;
			const query: RootFilterQuery<TTable> = {
				store: store._id || store_id,
			};

			let sort_config = null;
			if (sort && sort_by) {
				sort_config = {
					[sort_by]: sort,
				};
			}

			if (is_enabled !== null) {
				query.enabled = is_enabled;
			}

			const tables = await TablesModel.find(query, null, {
				sort: sort_config,
			}).limit(+(limit || 0));

			return res.status(200).json({ content: tables });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_to_waiter(
		req: Request<any, any, any, IListTablesFilters>,
		res: Response
	): Promise<Response<any>> {
		try {
			const { sort, is_enabled, sort_by, in_use, limit, store_id } = req.query;

			const query: RootFilterQuery<TTable> = {};

			let sort_config = null;
			if (sort && sort_by) {
				sort_config = {
					[sort_by]: sort,
				};
			}

			if (store_id) {
				query.store = store_id;
			}

			if (is_enabled !== null && is_enabled !== undefined) {
				query.enabled = is_enabled;
			}

			if (in_use !== null && is_enabled !== undefined) {
				query.in_use = in_use;
			}

			const tables = await TablesModel.find(query, null, {
				sort: sort_config,
			}).limit(+(limit || 0));

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

			// check if changed enabled tables if theres an active attendance
			if (Object.prototype.hasOwnProperty.call(payload, "enabled")) {
				const has_active_attendance = await store.has_active_attendance();

				if (has_active_attendance) {
					const active_attendance = await AttendancesModel.findOne({
						status: TAttendanceStatus.OPEN,
						store: store._id,
					});

					if (active_attendance) {
						const active_tables = await TablesModel.find({
							store: store._id,
							enabled: true,
						}).countDocuments();

						if (active_tables !== active_attendance.tables_count) {
							await active_attendance.updateOne({
								tables_count: active_tables,
							});
						}
					}
				}
			}

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
