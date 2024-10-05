import { timestamps } from "@core/index";
import { FileSchema } from "@modules/cloudinary";
import { Schema, model } from "mongoose";
import { Collections, IWaiterDocument, IWaitersModel, TWaiter } from "types";

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
		phone: {
			type: Number,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
		avatar: {
			type: FileSchema,
		},
	},
	{
		versionKey: false,
		timestamps,
		collection: Collections.Waiters,
	}
);

WaiterSchema.methods.toJSON = function (): TWaiter {
	const { password, ...waiter } = this.toObject();

	return waiter;
};

const WaitersModel: IWaitersModel = model<IWaiterDocument, IWaitersModel>(
	Collections.Waiters,
	WaiterSchema
);

export { WaiterSchema, WaitersModel };
