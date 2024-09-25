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
			type: Number,
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
	{ versionKey: false, timestamps: false, _id: false, id: false }
);

export { AddressSchema };
