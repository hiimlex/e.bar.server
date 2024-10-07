import { HttpException } from "@core/server";
import { IStoreDocument } from "@modules/stores";
import { generate_random_code } from "@utils/generate_random_code";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import {
	ATTENDANCE_COOKIE_NAME,
	COOKIE_MAX_AGE,
	IListAttendancesFilters,
	IPaginationResponse,
	IResponseLocals,
	IWaiterDocument,
	JWT_EXPIRES_IN,
	JWT_SECRET,
	TAttendance,
	TAttendanceStatus,
} from "types";
import { AttendancesModel } from "./attendances.schema";
import { RootFilterQuery } from "mongoose";
import { TablesModel } from "..";

class AttendanceRepository {
	async list(
		req: Request<any, any, any, IListAttendancesFilters>,
		res: Response<IPaginationResponse<TAttendance>, IResponseLocals>
	): Promise<Response<IPaginationResponse<TAttendance>>> {
		try {
			const { status, sort, sort_by } = req.query;

			const store: IStoreDocument = res.locals.store;
			const query: RootFilterQuery<TAttendance> = {
				store: store._id,
			};

			let sort_config = null;
			if (sort && sort_by) {
				sort_config = {
					[sort_by]: sort,
				};
			}

			if (status) {
				query.status = status;
			}

			const attendances = await AttendancesModel.find(query, null, {
				sort: sort_config,
			})
				.sort({ created_at: -1 })
				.collation({ locale: "en" });

			return res.status(200).json({ content: attendances });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_by_id(
		req: Request,
		res: Response
	): Promise<Response<TAttendance>> {
		try {
			const store: IStoreDocument = res.locals.store;

			const id = req.params.id;

			const attendance = await AttendancesModel.findOne({
				_id: id,
				store: store._id,
			});

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			return res.status(200).json(attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async get_by_code(
		req: Request,
		res: Response<TAttendance, IResponseLocals>
	): Promise<Response<TAttendance>> {
		try {
			const waiter = res.locals.waiter;
			const code = req.params.code;

			if (!code) {
				throw new HttpException(400, "CODE_NOT_PROVIDED");
			}

			const attendance = await AttendancesModel.findOne({
				code,
			});

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			if (!attendance.store.equals(waiter.store)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			return res.status(200).json(attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<TAttendance>> {
		try {
			const store: IStoreDocument = res.locals.store;

			const has_active_attendance = await store.has_active_attendance();

			if (has_active_attendance) {
				throw new HttpException(400, "STORE_ALREADY_HAS_AN_ACTIVE_ATTENDANCE");
			}

			const payload = req.body;

			const code = generate_random_code();

			if (payload.tables_count) {
				const total_tables = await TablesModel.find({
					store: store._id,
				}).countDocuments();

				if (payload.tables_count > total_tables) {
					for (let i = 0; i < payload.tables_count - total_tables; i++) {
						await TablesModel.create({
							store: store._id,
							number: total_tables + i + 1,
							enabled: true,
						});
					}
				}

				if (payload.tables_count < total_tables) {
					await TablesModel.updateMany(
						{
							store: store._id,
							number: { $gt: payload.tables_count },
						},
						{
							enabled: false,
						}
					);

					await TablesModel.updateMany(
						{
							store: store._id,
							number: { $lt: payload.tables_count + 1 },
						},
						{
							enabled: true,
						}
					);
				}
			}

			const attendance = await AttendancesModel.create({
				...payload,
				store: store._id,
				code,
			});

			return res.status(201).json(attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<TAttendance>> {
		try {
			const store: IStoreDocument = res.locals.store;

			const id = req.params.id;

			const payload = req.body;

			const attendance = await AttendancesModel.findOneAndUpdate(
				{
					_id: id,
					store: store._id,
				},
				payload,
				{ new: true }
			);

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			return res.status(201).json(attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async validate_attendance_code(
		req: Request,
		res: Response
	): Promise<Response<TAttendance>> {
		try {
			const code = req.params.code;

			if (!code) {
				throw new HttpException(400, "CODE_NOT_PROVIDED");
			}

			const waiter: IWaiterDocument = res.locals.waiter;

			const attendance = await AttendancesModel.findOne({
				code,
				store: waiter.store,
			});

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			if (attendance.status === TAttendanceStatus.CLOSED) {
				throw new HttpException(400, "ATTENDANCE_IS_CLOSED");
			}

			const waiter_has_already_validated_code = attendance.working_at.some(
				(el) => el.equals(waiter._id)
			);

			if (!waiter_has_already_validated_code) {
				await attendance.updateOne({
					$push: {
						working_at: waiter._id,
					},
				});
			}

			const attendance_id_hash = sign(
				{ id: attendance._id.toString() },
				JWT_SECRET,
				{
					expiresIn: JWT_EXPIRES_IN,
				}
			);

			const updated_attendance = await AttendancesModel.findOne({
				_id: attendance._id,
				code,
				store: waiter.store,
			});

			return res
				.status(200)
				.cookie(ATTENDANCE_COOKIE_NAME, attendance_id_hash, {
					httpOnly: true,
					signed: true,
					maxAge: COOKIE_MAX_AGE,
					secure: false,
					// sameSite: "none",
					// domain: process.env.FRONTEND_URL || "http://localhost:3001",
				})
				.json(updated_attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async close(req: Request, res: Response): Promise<Response<TAttendance>> {
		try {
			const store: IStoreDocument = res.locals.store;

			const id = req.params.id;

			const attendance = await AttendancesModel.findOneAndUpdate(
				{
					_id: id,
					store: store._id,
				},
				{
					status: TAttendanceStatus.CLOSED,
					closed_at: new Date(),
				},
				{ new: true }
			);

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			await TablesModel.updateMany(
				{
					store: store._id,
					number: { $lte: attendance.tables_count + 1 },
					in_use: false,
					in_use_by: null,
					in_use_with: null,
				},
				{ enabled: false }
			);

			return res.status(204).json();
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async add_table(req: Request, res: Response): Promise<Response<TAttendance>> {
		try {
			const store: IStoreDocument = res.locals.store;

			const id = req.params.id;

			const attendance = await AttendancesModel.findOne({
				_id: id,
				store: store._id,
			});

			const has_active_attendance = await store.has_active_attendance();

			if (!has_active_attendance) {
				throw new HttpException(400, "STORE_HAS_NO_ACTIVE_ATTENDANCE");
			}

			if (!attendance) {
				throw new HttpException(404, "ATTENDANCE_NOT_FOUND");
			}

			if (attendance.status === TAttendanceStatus.CLOSED) {
				throw new HttpException(400, "ATTENDANCE_IS_CLOSED");
			}

			const total_tables = await TablesModel.find({
				store: store._id,
			}).countDocuments();

			if (attendance.tables_count === total_tables) {
				const last_table_number = await TablesModel.find_last_number();

				await TablesModel.create({
					store: store._id,
					number: last_table_number + 1,
					enabled: true,
				});
			}

			if (attendance.tables_count < total_tables) {
				await TablesModel.findOneAndUpdate(
					{
						store: store._id,
						enabled: false,
						number: attendance.tables_count + 1,
					},
					{
						enabled: true,
					}
				);
			}

			await attendance.updateOne({
				$inc: {
					tables_count: 1,
				},
			});

			const updated_attendance = await AttendancesModel.findOne({
				_id: id,
				store: store._id,
			});

			return res.status(200).json(updated_attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const AttendanceRepositoryImpl = new AttendanceRepository();

export { AttendanceRepositoryImpl };
