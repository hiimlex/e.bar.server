import { Document, InferSchemaType, Model, Schema, Types, model } from "mongoose";
import { Collections } from "types";

const TableSchema = new Schema(
	{
		_id: {
			type: Schema.ObjectId,
			auto: true,
			required: true,
		},
		number: {
			type: Number,
			required: true,
		},
		seats: {
			type: Number,
			required: true,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
		in_use: {
			type: Boolean,
			default: false,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		// in_use_by: {
		// 	type:
		// }
	},
	{
		versionKey: false,
		timestamps: true,
		collection: Collections.Tables,
	}
);

type TTable = InferSchemaType<typeof TableSchema>;

interface ITableDocument extends Document<Types.ObjectId>, TTable {}

interface ITablesModel extends Model<ITableDocument> {}

const TablesModel: ITablesModel = model<ITableDocument, ITablesModel>(
	Collections.Tables,
	TableSchema
);

export { TableSchema, TTable, ITableDocument, ITablesModel, TablesModel };
