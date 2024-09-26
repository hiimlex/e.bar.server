import { Collections } from "@types";
import { Document, InferSchemaType, model, Model, Schema, Types } from "mongoose";

const ProductSchema = new Schema(
	{
		_id: {
			type: Schema.ObjectId,
			auto: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		category_id: {
			type: Schema.Types.ObjectId,
			ref: Collections.Categories,
			required: true,
		},
		store_id: {
			type: Schema.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
		picture: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		collection: Collections.Products,
	}
);

type TProduct = InferSchemaType<typeof ProductSchema>;

interface IProductDocument extends Document<Types.ObjectId>, TProduct {}

interface IProductsModel extends Model<IProductDocument> {}

const ProductsModel: IProductsModel = model<
	IProductDocument,
	IProductsModel
>(Collections.Products, ProductSchema);

export {ProductSchema, ProductsModel, IProductDocument, IProductsModel, TProduct};
