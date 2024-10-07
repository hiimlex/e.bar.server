import { timestamps } from "@core/config";
import { InferSchemaType, Schema } from "mongoose";
import { Collections, TOrderProductStatus } from "types";

const OrderProductSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
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
			enum: Object.values(TOrderProductStatus),
			default: TOrderProductStatus.PENDING,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps,
	}
);

export { OrderProductSchema };
