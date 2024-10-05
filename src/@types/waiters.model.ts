import { WaiterSchema } from "@modules/waiters";
import { InferSchemaType, Model, Types, Document } from "mongoose";
import { ISortFilter } from "./generic.model";

export type TWaiter = InferSchemaType<typeof WaiterSchema>;

export interface IWaiterDocument extends Document<Types.ObjectId>, TWaiter {}

export interface IWaitersModel extends Model<IWaiterDocument> {}

export interface IListWaitersFilters extends ISortFilter<"name"> {
	name?: string;
	store?: string;
	enabled?: boolean;
}
