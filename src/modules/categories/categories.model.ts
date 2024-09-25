import { Collections } from "@types";
import { InferSchemaType, model, Schema, Document, Model } from "mongoose";

const CategorySchema = new Schema(
	{
		store_id: {
			type: Schema.Types.ObjectId,
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

interface ICategoryDocument extends Document, TCategory {}

interface ICategoriesModel extends Model<ICategoryDocument> {}

const CategoriesModel: ICategoriesModel = model<
	ICategoryDocument,
	ICategoriesModel
>(Collections.Categories, CategorySchema);

export { CategoriesModel, ICategoryDocument, ICategoriesModel, TCategory };
