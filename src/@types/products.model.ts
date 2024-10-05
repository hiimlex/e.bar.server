import { ProductSchema } from "@modules/products";
import { InferSchemaType, Document, Types, Model } from "mongoose";
import { ISortFilter } from "./generic.model";
import { IPaginationFilters } from "./pagination";

export type TProduct = InferSchemaType<typeof ProductSchema>;

export interface IProductDocument extends Document<Types.ObjectId>, TProduct {
	populate_all: () => Promise<IProductDocument>;
}

export interface IProductsModelMethods {
	populate_all: () => Promise<IProductDocument>;
}

export interface IProductsModel
	extends Model<IProductDocument, {}, IProductsModelMethods> {}

export interface IListProductsFilters
	extends ISortFilter<"name" | "created_at" | "stock" | "price">,
		IPaginationFilters {
	store_id?: string;
	category_id?: string;
	name?: string;
	no_stock?: boolean;
}
