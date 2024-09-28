import { InferSchemaType, Schema } from "mongoose";

export const FileSchema = new Schema(
	{
		url: {
			type: String,
			required: true,
		},
		original_name: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
		_id: false,
	}
);

export type TFile = InferSchemaType<typeof FileSchema>;