import { OrderProductSchema } from "@modules/order_products";
import { OrderSchema } from "@modules/orders";
import { Document, InferSchemaType, Model, Types } from "mongoose";
import { ISortFilter } from "./generic.model";
import { IPaginationFilters } from "./pagination";

export enum TOrderStatus {
	PENDING = "PENDING",
	DELIVERED = "DELIVERED",
	FINISHED = "FINISHED",
	CANCELED = "CANCELED",
}

export type TOrder = InferSchemaType<typeof OrderSchema>;

export interface IOrderDocument extends TOrder, Document<Types.ObjectId> {
	populate_all: () => Promise<IOrderDocument>;
}

export interface IOrdersModelMethods {}

export interface IOrdersModel
	extends Model<IOrderDocument, {}, IOrdersModelMethods> {}

export type TOrderProduct = InferSchemaType<typeof OrderProductSchema>;

export enum TOrderProductStatus {
	PENDING = "PENDING",
	DELIVERED = "DELIVERED",
}

export interface IUpdateOrderProduct {
	order_product_id: string;
	status?: keyof typeof TOrderProductStatus;
	quantity?: number;
}

export interface IListOrdersFilters
	extends ISortFilter<"number" | "total">,
		IPaginationFilters {
	status?: keyof typeof TOrderStatus;
	order_product_status?: keyof typeof TOrderProductStatus;
}
