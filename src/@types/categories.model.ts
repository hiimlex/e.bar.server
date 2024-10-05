import { CategorySchema } from "@modules/categories";
import { InferSchemaType, Document, Types, Model } from "mongoose";

export type TCategory = InferSchemaType<typeof CategorySchema>;

export interface ICategoryDocument
	extends Document<Types.ObjectId>,
		TCategory {}

export interface ICategoriesModel extends Model<ICategoryDocument> {}

export interface IListCategoriesFilters {
	store_id?: string;
}
