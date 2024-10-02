import { timestamps } from "@core/config";
import { InferSchemaType, Schema } from "mongoose";
import { Collections } from "types";

enum OrderProductStatus {
	PENDING = "PENDING",
	DELIVERED = "DELIVERED",
}

const OrderProductSchema = new Schema(
	{
		product: {
			type: Schema.Types.ObjectId,
			ref: Collections.Products,
		},
		quantity: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(OrderProductStatus),
			default: OrderProductStatus.PENDING,
			required: false,
		},
	},
	{
		versionKey: false,
		timestamps,
	}
);

type TOrderProduct = InferSchemaType<typeof OrderProductSchema>;

export { OrderProductSchema, TOrderProduct, OrderProductStatus };
