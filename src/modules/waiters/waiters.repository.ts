import { IStoreDocument } from "@modules/stores";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { IWaiterDocument, TWaiter, WaitersModel } from "./waiters.model";
import { TFile } from "@modules/cloudinary";
import { TUploadedFile } from "types/files";
import { HttpException } from "@core/server";
import { hash } from "bcrypt";
import { SALT_ROUNDS } from "types";

class WaitersRepository {
	async list(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const waiters = await WaitersModel.find({ store: store._id });

			return res.status(200).json({ content: waiters });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async list_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const id = req.params.id;

			const waiter = await WaitersModel.findOne({
				_id: id,
				store: store._id,
			});

			return res.status(200).json(waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<TWaiter>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const { password, ...payload } = req.body;

			const hash_password = await hash(password, SALT_ROUNDS);

			const waiter = await WaitersModel.create({
				...payload,
				store: store._id,
				password: hash_password,
			});

			return res.status(201).json(waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<TWaiter>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const id = req.params.id;

			const payload = req.body;

			const waiter = await WaitersModel.findOne({
				_id: id,
				store: store._id,
			});

			if (!waiter) {
				throw new HttpException(404, "WAITER_NOT_FOUND");
			}

			if (!waiter.store.equals(store._id)) {
				throw new HttpException(403, "FORBIDDEN");
			}

			await waiter.updateOne(payload);

			const updated_waiter = await WaitersModel.findOne({
				_id: id,
				store: store._id,
			});

			return res.status(201).json(updated_waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<null>> {
		try {
			const store: IStoreDocument = res.locals.store;
			const id = req.params.id;

			const waiter = await WaitersModel.findOne({
				_id: id,
				store: store._id,
			});

			if (!waiter) {
				throw new HttpException(404, "WAITER_NOT_FOUND");
			}

			return res.status(204).send(null);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async profile(req: Request, res: Response): Promise<Response<TWaiter>> {
		try {
			const waiter: IWaiterDocument = res.locals.waiter;

			return res.status(200).json(waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update_profile(
		req: Request,
		res: Response
	): Promise<Response<TWaiter>> {
		try {
			const waiter: IWaiterDocument = res.locals.waiter;

			const payload = req.body;

			if (req.file) {
				const file = req.file as TUploadedFile;
				const avatar: TFile = {
					url: file.path,
					original_name: file.originalname,
				};
				payload.avatar = avatar;
			}

			await waiter.updateOne(payload);

			const updated_waiter = await WaitersModel.findOne({
				_id: waiter._id,
			});

			return res.status(201).json(updated_waiter);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const WaitersRepositoryImpl = new WaitersRepository();

export { WaitersRepositoryImpl };
