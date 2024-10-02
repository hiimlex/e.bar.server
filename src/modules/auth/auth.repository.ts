import { get_bearer_token, handle_error } from "@utils";
import { compare } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, decode } from "jsonwebtoken";
import { ATTENDANCE_COOKIE_NAME, JWT_EXPIRES_IN, JWT_SECRET } from "types";
import {
	AttendancesModel,
	IStoreDocument,
	IWaiterDocument,
	StoresModel,
	TWaiter,
	WaitersModel,
} from "..";
import { HttpException } from "../../core";

class AuthRepository {
	async login(req: Request, res: Response): Promise<Response<void>> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			const store_admin = await StoresModel.findOne({ email });
			const waiter = await WaitersModel.findOne({
				email,
			});

			if (!store_admin && !waiter) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			const is_store = !!store_admin;
			const ref: IStoreDocument | IWaiterDocument | null =
				store_admin || waiter || null;

			if (!ref) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			const is_valid = await compare(password, ref.password);

			if (!is_valid) {
				throw new HttpException(400, "INVALID_PASSWORD");
			}

			const access_token = jwt.sign({ id: ref._id }, JWT_SECRET, {
				expiresIn: JWT_EXPIRES_IN,
			});

			return res.status(200).json({ access_token, is_store });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async is_authenticated(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response | void> {
		try {
			const access_token = get_bearer_token(req);

			if (!access_token) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const jwt_verify = jwt.verify(access_token, JWT_SECRET);

			if (!jwt_verify) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			next();
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async me(req: Request, res: Response): Promise<Response<void>> {
		try {
			const access_token = get_bearer_token(req);

			if (!access_token) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const jwt_decoded: JwtPayload | null | string = decode(access_token, {
				json: true,
			});

			if (!jwt_decoded) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const { id: entity_id } = jwt_decoded;

			const store = await StoresModel.findById(entity_id);
			const waiter = await WaitersModel.findById(entity_id);

			const is_store = !!store;

			return res.status(200).json({ store, waiter, is_store });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async is_store(req: Request, res: Response, next: NextFunction) {
		try {
			const access_token = get_bearer_token(req);

			if (!access_token) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const jwt_decoded: JwtPayload | null | string = decode(access_token, {
				json: true,
			});

			if (!jwt_decoded) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const { id: store_id } = jwt_decoded;

			if (!store_id) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const store = await StoresModel.findById(store_id);

			if (!store) {
				throw new HttpException(403, "FORBIDDEN");
			}

			res.locals.store = store;

			next();
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async is_waiter(req: Request, res: Response, next: NextFunction) {
		try {
			const access_token = get_bearer_token(req);

			if (!access_token) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const jwt_decoded: JwtPayload | null | string = decode(access_token, {
				json: true,
			});

			if (!jwt_decoded) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const { id: waiter_id } = jwt_decoded;

			if (!waiter_id) {
				throw new HttpException(401, "UNAUTHORIZED");
			}

			const waiter = await WaitersModel.findById(waiter_id);

			if (!waiter) {
				throw new HttpException(403, "FORBIDDEN");
			}

			res.locals.waiter = waiter;

			next();
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async is_on_attendance(req: Request, res: Response, next: NextFunction) {
		try {
			const waiter: IWaiterDocument = res.locals.waiter;

			const attendance_cookie =
				req.signedCookies[ATTENDANCE_COOKIE_NAME] ||
				req.cookies[ATTENDANCE_COOKIE_NAME];

			if (!attendance_cookie) {
				throw new HttpException(403, "FORBIDDEN");
			}

			const decoded_attendance = decode(attendance_cookie, { json: true });

			if (!decoded_attendance) {
				throw new HttpException(403, "FORBIDDEN");
			}

			const { id } = decoded_attendance;

			const attendance = await AttendancesModel.findById(id);

			if (!attendance) {
				throw new HttpException(403, "FORBIDDEN");
			}

			if (!attendance.working_at.some((el) => el.equals(waiter._id))) {
				throw new HttpException(403, "FORBIDDEN");
			}

			res.locals.attendance = attendance;

			next();
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async get_store_by_token(
		req: Request,
		res: Response
	): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;

			return res.status(200).json(store);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async get_waiter_by_token(
		req: Request,
		res: Response
	): Promise<Response<TWaiter>> {
		try {
			const waiter: IWaiterDocument = res.locals.waiter;

			return res.status(200).json(waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const AuthRepositoryImpl = new AuthRepository();

export { AuthRepositoryImpl };
