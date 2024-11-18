import { HttpException } from "@core/server";
import { handle_error } from "@utils/handle_error";
import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import {
	IPaginationResponse,
	IWaiterDocument,
	TAttendance,
	TOrderStatus,
	TPayment,
	TPaymentMethod,
	TWaiter,
} from "types";
import { OrdersModel, TablesModel } from "..";
import { PaymentsModel } from "./payments.schema";

class PaymentsRepository {
	async list(
		req: Request,
		res: Response<IPaginationResponse<TPayment>>
	): Promise<Response<IPaginationResponse<TPayment>>> {
		try {
			const { store_id } = req.query;

			const query: FilterQuery<TPayment> = {
				store: store_id,
			};

			if (store_id) {
				query.store = store_id;
			}

			const payments = await PaymentsModel.find(query);

			return res.status(200).json({ content: payments });
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async show_by_order_id(
		req: Request,
		res: Response
	): Promise<Response<TPayment>> {
		try {
			const { order_id, store_id } = req.params;

			if (!order_id) {
				throw new HttpException(404, "ORDER_NOT_FOUND");
			}

			const payment = await PaymentsModel.findOne({
				order: order_id,
				store: store_id,
			});

			return res.status(200).json(payment);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<Response<TPayment>> {
		try {
			const waiter = res.locals.waiter as TWaiter;
			const attendance = res.locals.attendance as TAttendance;
			const {
				amount,
				method,
				cash_config,
				pix_config,
				credit_card_config,
				order_id,
			} = req.body;

			const new_payment_data: Partial<TPayment> = {
				amount,
				method,
				attendance: attendance._id,
				order: order_id,
				store: waiter.store,
			};

			const order = await OrdersModel.findOne({
				_id: order_id,
				store: waiter.store,
			});

			if (!order) {
				throw new HttpException(400, "ORDER_NOT_FOUND");
			}

			if (order.payment) {
				throw new HttpException(400, "ORDER_ALREADY_PAID");
			}

			if (method === TPaymentMethod.Cash) {
				new_payment_data.cash_config = cash_config;
			}

			if (method === TPaymentMethod.Pix) {
				new_payment_data.pix_config = pix_config;
			}

			if (method === TPaymentMethod.CreditCard) {
				new_payment_data.credit_card_config = credit_card_config;
			}

			const payment = await PaymentsModel.create(new_payment_data);

			await order.updateOne({
				payment: payment._id,
				status: TOrderStatus.FINISHED,
			});

			const table = await TablesModel.findOne({
				_id: order.table,
			});

			if (table) {
				await table.updateOne({
					in_use: false,
					in_use_by: null,
					order: null,
				});
			}

			return res.status(201).json(payment);
		} catch (error) {
			return handle_error(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<Response<TPayment>> {
		try {
			const waiter = res.locals.waiter as IWaiterDocument;

			const { id: payment_id } = req.params;
			const { method, cash_config, pix_config, credit_card_config } = req.body;

			const payment = await PaymentsModel.findOneAndUpdate(
				{
					store: waiter.store,
					_id: payment_id,
				},
				{
					method,
					cash_config: method === TPaymentMethod.Cash ? cash_config : null,
					pix_config: method === TPaymentMethod.Pix ? pix_config : null,
					credit_card_config:
						method === TPaymentMethod.CreditCard ? credit_card_config : null,
				},
				{
					new: true,
				}
			);

			return res.status(200).json(payment);
		} catch (error) {
			return handle_error(res, error);
		}
	}
}

const PaymentsRepositoryImpl = new PaymentsRepository();

export { PaymentsRepositoryImpl };
