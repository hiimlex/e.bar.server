import { timestamps } from "@core/index";
import { OrderProductSchema } from "@modules/order_products";
import {
	InferSchemaType,
	Schema,
	Document,
	Types,
	Model,
	model,
} from "mongoose";
import { Collections } from "types";

export enum OrderStatus {
	PENDING = "PENDING",
	DELIVERED = "DELIVERED",
	FINISHED = "FINISHED",
	CANCELED = "CANCELED",
}

const OrderSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		attendance: {
			type: Schema.Types.ObjectId,
			ref: Collections.Attendances,
			required: true,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		requested_by: {
			type: Schema.Types.ObjectId,
			ref: Collections.Waiters,
		},
		table: {
			type: Schema.Types.ObjectId,
			ref: Collections.Tables,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.PENDING,
			required: true,
		},
		items: {
			type: [OrderProductSchema],
			required: false,
		},
		customers: {
			type: Number,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps,
		collection: Collections.Orders,
	}
);

type TOrder = InferSchemaType<typeof OrderSchema>;

interface IOrderDocument extends TOrder, Document<Types.ObjectId> {}

interface IOrdersModelMethods {}

interface IOrdersModel extends Model<IOrderDocument, {}, IOrdersModelMethods> {}

const OrdersModel: IOrdersModel = model<IOrderDocument, IOrdersModel>(
	Collections.Orders,
	OrderSchema
);

export { OrdersModel, IOrderDocument, TOrder, OrderSchema };
