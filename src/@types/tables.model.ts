import { TableSchema } from "@modules/tables";
import { InferSchemaType, Document, Types, Model } from "mongoose";
import { ISortFilter } from "./generic.model";
import { IPaginationFilters } from "./pagination";

export type TTable = InferSchemaType<typeof TableSchema>;

export interface ITableDocument extends Document<Types.ObjectId>, TTable {}

export interface ITablesModel extends Model<ITableDocument> {
	find_last_number: () => Promise<number>;
}

export interface IListTablesFilters
	extends ISortFilter<"number">,
		IPaginationFilters {
	store_id?: Types.ObjectId;
	is_enabled?: boolean;
	in_use?: boolean;
}
