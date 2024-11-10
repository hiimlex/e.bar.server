import { timestamps } from "@core/config";
import { Schema, model } from "mongoose";
import {
	Collections,
	IPaymentDocument,
	IPaymentsModel,
	TPaymentMethod,
} from "types";

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
		},
		method: {
			type: String,
			enum: Object.values(TPaymentMethod),
			required: true,
		},
		pix_config: {
			type: new Schema(
				{
					name: String,
				},
				{ _id: false, versionKey: false }
			),
			required: false,
		},
		cash_config: {
			type: new Schema(
				{
					charge: Number,
				},
				{ _id: false, versionKey: false }
			),
			required: false,
		},
		credit_card_config: {
			type: new Schema(
				{
					nf: String,
				},
				{ _id: false, versionKey: false }
			),
			required: false,
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

export { PaymentSchema, PaymentsModel };
