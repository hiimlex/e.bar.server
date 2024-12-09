import { timestamps } from "@core/config";
import { Schema, model } from "mongoose";
import {
	Collections,
	IPaymentDocument,
	IPaymentsModel,
	TPaymentMethod,
} from "types";

const PaymentItemSchema = new Schema(
	{
		method: {
			type: String,
			enum: Object.values(TPaymentMethod),
			required: true,
		},
		charge_back: {
			type: Number,
			required: false,
		},
		nf_number: {
			type: String,
			required: false,
		},
		received_value: {
			type: Number,
			required: true,
		},
	},
	{ versionKey: false }
);

const PaymentSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
			default: 0,
		},
		remaining: {
			type: Number,
			required: false,
			default: 0,
		},
		items: {
			type: [PaymentItemSchema],
		},
		order: {
			type: Schema.Types.ObjectId,
			ref: Collections.Orders,
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
	},
	{
		versionKey: false,
		timestamps,
		collection: Collections.Payments,
	}
);

const PaymentsModel: IPaymentsModel = model<IPaymentDocument, IPaymentsModel>(
	Collections.Payments,
	PaymentSchema
);

export { PaymentSchema, PaymentsModel, PaymentItemSchema };
