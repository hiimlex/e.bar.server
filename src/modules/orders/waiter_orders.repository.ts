import { HttpException } from "@core/server";
import { IAttendanceDocument } from "@modules/attendances";
import { IWaiterDocument } from "@modules/waiters";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { IPaginationResponse } from "types";
import { OrdersModel, OrderStatus, TOrder } from "./orders.model";
import { TOrderProduct } from "@modules/order_products";
import { ProductsModel } from "@modules/products";

class WaiterOrdersRepository {
	async list(
		req: Request,
		res: Response<IPaginationResponse<TOrder>>
	): Promise<Response<IPaginationResponse<TOrder>>> {
		try {
			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const orders = await OrdersModel.find({
				requested_by: waiter._id,
				attendance: attendance._id,
			});

			return res.status(200).json({ content: orders });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async show_by_id(req: Request, res: Response): Promise<Response<any>> {
		try {
			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const order_id = req.params.id;

			const order = await OrdersModel.findOne({
				_id: order_id,
				requested_by: waiter._id,
				attendance: attendance._id,
			});

			if (!order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			return res.status(200).json(order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<any>> {
		try {
			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const { table, customers } = req.body;

			const last_order = await OrdersModel.findOne({
				attendance: attendance._id,
			}).sort({ number: -1 });

			const order_number = last_order ? last_order.number + 1 : 1;

			const order = await OrdersModel.create({
				store: attendance.store,
				attendance: attendance._id,
				requested_by: waiter._id,
				table,
				customers,
				number: order_number,
			});

			return res.status(201).json(order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<any>> {
		try {
			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const order_id = req.params.id;

			const order = await OrdersModel.findOne({
				_id: order_id,
				requested_by: waiter._id,
				attendance: attendance._id,
			});

			if (!order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			const { items, status } = req.body;

			const order_products: TOrderProduct[] = [];

			if (items && items.length > 0) {
				for (const item of items) {
					const { product_id, quantity } = item;

					const product = await ProductsModel.findById(product_id);

					if (product) {
						order_products.push({
							product: product_id,
							quantity,
							total: product.price * quantity,
						});
					}
				}
			}

			await order.updateOne({
				items: order_products,
				status,
			});

			const updated_order = await OrdersModel.findById(order_id);

			return res.status(201).json(updated_order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async cancel(req: Request, res: Response): Promise<Response<any>> {
		try {
			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const order_id = req.params.id;

			const order = await OrdersModel.findOne({
				_id: order_id,
				requested_by: waiter._id,
				attendance: attendance._id,
			});

			if (!order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			if (order.status !== OrderStatus.PENDING) {
				throw new HttpException(400, "CANNOT_CANCEL_ORDER");
			}

			await order.updateOne({
				status: OrderStatus.CANCELED,
			});

			const updated_order = await OrdersModel.findById(order_id);

			return res.status(200).json(updated_order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async finish(req: Request, res: Response): Promise<Response<any>> {
		try {
			return res.json({});
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const WaiterOrdersRepositoryImpl = new WaiterOrdersRepository();

export { WaiterOrdersRepositoryImpl };
