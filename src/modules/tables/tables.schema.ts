import { timestamps } from "@core/index";
import {
	Document,
	InferSchemaType,
	Model,
	Schema,
	Types,
	model,
} from "mongoose";
import { Collections, ITableDocument, ITablesModel } from "types";

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
		enabled: {
			type: Boolean,
			default: false,
		},
		in_use: {
			type: Boolean,
			default: false,
			required: true,
		},
		in_use_by: {
			type: Schema.Types.ObjectId,
			ref: Collections.Waiters,
			required: false,
		},
		order: {
			type: Schema.Types.ObjectId,
			ref: Collections.Orders,
			required: false,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
	},
	{
		versionKey: false,
		timestamps,
		collection: Collections.Tables,
	}
);

TableSchema.statics.find_last_number = async function (): Promise<number> {
	const last_table = await this.findOne().sort({ number: -1 });
	return last_table ? last_table.number : 0;
};

TableSchema.methods.populate_all = async function (): Promise<ITableDocument> {
	await this.populate("in_use_by", "_id name phone email");
	await this.populate("order", "_id number status customers total");

	return this as ITableDocument;
};

const TablesModel: ITablesModel = model<ITableDocument, ITablesModel>(
	Collections.Tables,
	TableSchema
);

export { TableSchema, TablesModel };
