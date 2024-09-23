import { Schema } from "mongoose";

const AddressSchema = new Schema(
	{
		cep: {
			type: Number,
			required: true,
		},
		street: {
			type: String,
			required: true,
		},
		number: {
			type: String,
			required: true,
		},
		complement: {
			type: String,
		},
		neighborhood: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false, timestamps: false, _id: false }
);

export { AddressSchema };
