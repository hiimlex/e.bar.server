import {
	Document,
	InferSchemaType,
	Model,
	Schema,
	Types,
	model,
} from "mongoose";
import { Collections } from "types";

const WaiterSchema = new Schema(
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
		email: {
			type: String,
			required: true,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		collection: Collections.Tables,
	}
);

type TWaiter = InferSchemaType<typeof WaiterSchema>;

interface IWaiterDocument extends Document<Types.ObjectId>, TWaiter {}

interface IWaitersModel extends Model<IWaiterDocument> {}

const TablesModel: IWaitersModel = model<IWaiterDocument, IWaitersModel>(
	Collections.Tables,
	WaiterSchema
);

export { WaiterSchema, TWaiter, IWaiterDocument, IWaitersModel, TablesModel };
