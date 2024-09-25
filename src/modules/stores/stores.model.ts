import { ObjectId, InferSchemaType, model, Model, Schema } from "mongoose";
import { Collections } from "@types";
import { AddressSchema } from "../address";

const StoreSchema = new Schema(
	{
		_id: {
			type: Schema.ObjectId,
			auto: true,
		},
		name: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		// avatar: {
		// 	type: String,
		// 	default: "",
		// },
		// files: {
		// 	type: [String],
		// 	default: [],
		// },
		address: {
			type: AddressSchema,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
		collection: Collections.Stores,
	}
);

type TStore = InferSchemaType<typeof StoreSchema>;

interface IStoreDocument extends Document, TStore {
	populateAll(): Promise<IStoreDocument>;
}

interface IStoreMethods {}

interface IStoresModel extends Model<IStoreDocument, IStoreMethods> {
	populateAll(): Promise<IStoresModel>;
}

// StoreSchema.plugin(uniqueValidator, { message: "{PATH} já está em uso." });

// StoreSchema.methods.toJSON = function (): TStore {
// 	const barber = this.toObject();

// 	return barber;
// };

StoreSchema.methods.populateAll = async function (): Promise<IStoreDocument> {
	// await this.populate("avatar");

	return this as IStoreDocument;
};

StoreSchema.pre("save", async function (next) {
	// const barber = this;

	next();
});

const StoresModel: IStoresModel = model<IStoreDocument, IStoresModel>(
	Collections.Stores,
	StoreSchema
);

export { TStore, IStoreDocument, IStoresModel, StoresModel };
