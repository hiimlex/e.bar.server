import { Collections } from "@types";
import { InferSchemaType, model, Schema, Document, Model, Types } from "mongoose";

const CategorySchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true, required: true },
		store_id: {
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

type TCategory = InferSchemaType<typeof CategorySchema>;

interface ICategoryDocument extends Document<Types.ObjectId>, TCategory {}

interface ICategoriesModel extends Model<ICategoryDocument> {}

const CategoriesModel: ICategoriesModel = model<
	ICategoryDocument,
	ICategoriesModel
>(Collections.Categories, CategorySchema);

export { CategoriesModel, ICategoryDocument, ICategoriesModel, TCategory };
