import { HttpException } from "../../core";
import { handle_error } from "@utils";
import { NextFunction, Request, Response } from "express";
import { IStoreDocument, StoresModel } from "..";
import { compare } from "bcrypt";
import jwt, { JwtPayload, decode } from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "types";
import { get_bearer_token } from "@utils";
import { Types } from "mongoose";

class AuthRepository {
	async login(req: Request, res: Response): Promise<Response<void>> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			const store_admin = await StoresModel.findOne({ email });

			if (!store_admin) {
				throw new HttpException(400, "USER_NOT_FOUND");
			}

			const is_store = !!store_admin || false;
			const ref: IStoreDocument | { password: string; _id: Types.ObjectId } =
				store_admin || {};

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

	async get_store_by_token(
		req: Request,
		res: Response
	): Promise<Response<any>> {
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
				throw new HttpException(401, "STORE_NOT_FOUND");
			}

			return res.status(200).json(store);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const AuthRepositoryImpl = new AuthRepository();

export { AuthRepositoryImpl };
