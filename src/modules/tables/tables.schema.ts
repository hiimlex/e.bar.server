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
		},
		in_use_by: {
			type: Schema.Types.ObjectId,
			ref: Collections.Waiters,
		},
		customers: {
			type: Number,
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

const TablesModel: ITablesModel = model<ITableDocument, ITablesModel>(
	Collections.Tables,
	TableSchema
);

export { TableSchema, TablesModel };
