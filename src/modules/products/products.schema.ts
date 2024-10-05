import { timestamps } from "@core/index";
import {
	Document,
	InferSchemaType,
	model,
	Model,
	Schema,
	Types,
} from "mongoose";
import { Collections, IProductDocument, IProductsModel } from "types";
import { FileSchema } from "../cloudinary";

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
		stock: {
			type: Number,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: Collections.Categories,
			required: true,
		},
		store: {
			type: Schema.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
		picture: {
			type: FileSchema,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		versionKey: false,
		collection: Collections.Products,
		timestamps,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	}
);

ProductSchema.methods.populate_all = async function (this: IProductDocument) {
	await this.populate("category");

	return;
};

const ProductsModel: IProductsModel = model<IProductDocument, IProductsModel>(
	Collections.Products,
	ProductSchema
);

export { ProductSchema, ProductsModel };
