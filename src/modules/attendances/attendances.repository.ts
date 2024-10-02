import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import {
	ATTENDANCE_COOKIE_NAME,
	COOKIE_MAX_AGE,
	IPaginationResponse,
	IResponseLocals,
	JWT_EXPIRES_IN,
	JWT_SECRET,
	SALT_ROUNDS,
} from "types";
import { AttendancesModel, TAttendance } from "./attendances.model";
import { IStoreDocument } from "@modules/stores";
import { HttpException } from "@core/server";
import { generate_random_code } from "@utils/generate_random_code";
import { r } from "@faker-js/faker/dist/airline-C5Qwd7_q";
import { IWaiterDocument } from "@modules/waiters";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";

class AttendanceRepository {
	async list(
		req: Request,
		res: Response<IPaginationResponse<TAttendance>, IResponseLocals>
	): Promise<Response<IPaginationResponse<TAttendance>>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const attendances = await AttendancesModel.find({
				store: store._id,
			});

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

			const waiter_has_already_validated_code = attendance.working_at.some((el) =>
				el.equals(waiter._id)
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

			res.cookie(ATTENDANCE_COOKIE_NAME, attendance_id_hash, {
				httpOnly: true,
				signed: true,
				maxAge: COOKIE_MAX_AGE,
				path: '/api/w-orders'
			});

			return res.status(200).json(attendance);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const AttendanceRepositoryImpl = new AttendanceRepository();

export { AttendanceRepositoryImpl };
