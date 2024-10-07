import { HttpException } from "@core/server";
import { ProductsModel } from "@modules/products";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { RootFilterQuery, Types } from "mongoose";
import {
	IAttendanceDocument,
	IListOrdersFilters,
	IPaginationResponse,
	IUpdateOrderProduct,
	IWaiterDocument,
	TOrder,
	TOrderProduct,
	TOrderProductStatus,
	TOrderStatus,
} from "types";
import { TablesModel } from "..";
import { OrdersModel } from "./orders.schema";

class WaiterOrdersRepository {
	async list(
		req: Request<any, any, any, IListOrdersFilters>,
		res: Response<IPaginationResponse<TOrder>>
	): Promise<Response<IPaginationResponse<TOrder>>> {
		try {
			const {
				status,
				order_product_status,
				limit,
				offset,
				page,
				sort,
				sort_by,
			} = req.query;

			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const query: RootFilterQuery<TOrder> = {
				requested_by: waiter._id,
				attendance: attendance._id,
			};

			if (status) {
				query.status = status;
			}

			let sort_config = null;
			if (sort && sort_by) {
				sort_config = { [sort_by]: sort };
			}

			const orders = await OrdersModel.find(query, null, {
				sort: sort_config,
			}).limit(+(limit || 0));

			for (const order of orders) {
				await order.populate_all();
			}

			return res.status(200).json({ content: orders });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async show_by_id(
		req: Request<any, any, any, IListOrdersFilters>,
		res: Response
	): Promise<Response<any>> {
		try {
			const { order_product_status, sort, sort_by } = req.query;

			const attendance: IAttendanceDocument = res.locals.attendance;
			const waiter: IWaiterDocument = res.locals.waiter;

			const order_id = req.params.id;

			const query: RootFilterQuery<TOrder> = {
				_id: order_id,
				requested_by: waiter._id,
				attendance: attendance._id,
			};

			const order = await OrdersModel.findOne(query);

			if (!order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			await order.populate_all();

			if (order_product_status && order.items) {
				const order_products = order.items.filter(
					(op) => op.status === order_product_status
				);
				order.items = order_products as any;
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

			const { table_id, customers } = req.body;

			const last_order = await OrdersModel.findOne({
				attendance: attendance._id,
			}).sort({ number: -1 });

			const order_number = last_order ? last_order.number + 1 : 1;

			const table = await TablesModel.findOne({
				_id: table_id,
				store: attendance.store,
			});

			if (!table) {
				throw new HttpException(404, "TABLE_NOT_FOUND");
			}

			const order = await OrdersModel.create({
				store: attendance.store,
				attendance: attendance._id,
				requested_by: waiter._id,
				table: table_id,
				customers,
				number: order_number,
			});

			await table.updateOne({
				in_use: true,
				in_use_by: waiter._id,
				order: order._id,
			});

			await order.populate_all();

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

			const { status, customers } = req.body;

			await order.updateOne({
				status,
				customers,
			});

			if (!!customers) {
				const table = await TablesModel.findOne({
					_id: order.table,
					store: attendance.store,
				});

				if (table) {
					await table.updateOne({
						customers,
					});
				}
			}

			const updated_order = await OrdersModel.findById(order_id);

			if (!updated_order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			await updated_order.populate_all();

			return res.status(201).json(updated_order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async add_item(req: Request, res: Response): Promise<Response<TOrder>> {
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

			const { items } = req.body;

			const order_products: TOrderProduct[] = [];

			if (items && items.length > 0) {
				for (const item of items) {
					const { product_id, quantity } = item;

					const product = await ProductsModel.findById(product_id);

					if (product && quantity <= product.stock) {
						order_products.push({
							product: product_id,
							quantity,
							total: product.price * quantity,
							_id: new Types.ObjectId(),
							status: TOrderProductStatus.PENDING,
						});

						await product.updateOne({
							stock: product.stock - quantity,
						});
					}
				}
			}

			await order.updateOne({
				items: order_products,
			});

			const updated_order = await OrdersModel.findById(order_id);

			if (!updated_order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			await updated_order.populate_all();

			return res.status(201).json(updated_order);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update_item(req: Request, res: Response): Promise<Response<any>> {
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

			const { items } = req.body;

			if (!order.items || order.items.length === 0) {
				throw new HttpException(400, "NO_ORDER_PRODUCTS");
			}

			let order_products: (TOrderProduct | null)[] = await Promise.all(
				order.items.map(async (op) => {
					if (op.status === TOrderProductStatus.DELIVERED) {
						return op;
					}

					const items_t = items as IUpdateOrderProduct[];
					const item_to_update = items_t.find(
						(item) => item.order_product_id === op._id.toString()
					);

					if (item_to_update) {
						const product = await ProductsModel.findById(op.product);

						const update_quantity = Object.hasOwnProperty.call(
							item_to_update,
							"quantity"
						);
						const update_status = Object.hasOwnProperty.call(
							item_to_update,
							"status"
						);

						if (update_status && item_to_update.status) {
							op.status = item_to_update.status as TOrderProductStatus;
						}

						if (
							update_quantity &&
							item_to_update.quantity?.toString() &&
							product &&
							item_to_update.quantity <= product.stock
						) {
							const is_zero = item_to_update.quantity === 0;
							const diff = item_to_update.quantity - op.quantity;

							op.quantity = item_to_update.quantity;

							await product.updateOne({
								stock: product.stock - diff,
							});

							if (is_zero) {
								return null;
							}
						}
					}

					return op;
				})
			);

			order_products = order_products.filter((op) => !!op);

			await order.updateOne({
				items: order_products,
			});

			const updated_order = await OrdersModel.findById(order_id);

			if (!updated_order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			await updated_order.populate_all();

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

			if (order.status !== TOrderStatus.PENDING) {
				throw new HttpException(400, "CANNOT_CANCEL_ORDER");
			}

			await order.updateOne({
				status: TOrderStatus.CANCELED,
			});

			const updated_order = await OrdersModel.findById(order_id);

			if (!updated_order) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			await updated_order.populate_all();

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
