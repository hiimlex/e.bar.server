import { PaymentItemSchema, PaymentSchema } from "@modules/payments";
import { InferSchemaType, Document, Types, Model } from "mongoose";
import { IPaginationFilters } from "./pagination";
import { ISortFilter } from "./generic.model";

export enum TPaymentMethod {
	Pix = "pix",
	CreditCard = "credit_card",
	Cash = "cash",
}

export type TPayment = InferSchemaType<typeof PaymentSchema>;
export type TPaymentItem = InferSchemaType<typeof PaymentItemSchema>

export interface IPaymentDocument extends TPayment, Document<Types.ObjectId> {}

export interface IPaymentsModelMethods {}

export interface IPaymentsModel
	extends Model<IPaymentDocument, {}, IPaymentsModelMethods> {}

export interface IListPayments
	extends ISortFilter<"amount">,
		IPaginationFilters {
	store_id: string;
}
