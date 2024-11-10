import { timestamps } from "@core/index";
import { OrderProductSchema } from "@modules/order_products";
import { Schema, model } from "mongoose";
import { Collections, IOrderDocument, IOrdersModel, TOrderStatus } from "types";

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
		payment: {
			type: Schema.Types.ObjectId,
			ref: Collections.Payments,
			required: false,
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
			enum: Object.values(TOrderStatus),
			default: TOrderStatus.PENDING,
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
		delivered_at: {
			type: Date,
			required: false,
		},
		total: {
			type: Number,
		},
	},
	{
		versionKey: false,
		timestamps,
		collection: Collections.Orders,
	}
);

OrderSchema.methods.populate_all = async function () {
	const order = this as IOrderDocument;

	await order.populate("attendance", "code tables count");
	await order.populate("requested_by", "name");
	await order.populate("table", "number");
	await order.populate("store", "name");
	await order.populate("items.product", "name price picture stock");
	await order.populate("payment", "-_id method pix_config credit_card_config cash_config");

	if (order.items) {
		order.total = order.items.reduce((acc, item) => acc + item.total, 0);
	}

	return this;
};

OrderSchema.pre("save", async function () {
	const order = this as IOrderDocument;

	if (order.items) {
		order.total = order.items.reduce((acc, item) => acc + item.total, 0);
	}

	return this;
});

const OrdersModel: IOrdersModel = model<IOrderDocument, IOrdersModel>(
	Collections.Orders,
	OrderSchema
);

export { OrderSchema, OrdersModel };
