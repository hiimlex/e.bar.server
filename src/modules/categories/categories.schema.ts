import { Schema, model } from "mongoose";
import { Collections, ICategoriesModel, ICategoryDocument } from "types";

const CategorySchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true, required: true },
		store: {
			type: Schema.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false, timestamps: false, collection: Collections.Categories }
);

const CategoriesModel: ICategoriesModel = model<
	ICategoryDocument,
	ICategoriesModel
>(Collections.Categories, CategorySchema);

export { CategoriesModel, CategorySchema };
