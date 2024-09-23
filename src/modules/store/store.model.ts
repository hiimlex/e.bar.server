import { InferSchemaType, model, Model, Schema } from "mongoose";
import { Collections } from "src/@types";
import { AddressSchema } from "../address";

const StoreSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
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
	},
	{
		versionKey: false,
		id: true,
		_id: false,
		timestamps: true,
		collection: Collections.Stores,
	}
);

type TStore = InferSchemaType<typeof StoreSchema>;

interface IStoreDocument extends Document, TStore {
	populateAll(): Promise<IStoreDocument>;
}

interface IStoreMethods {}

interface IStoreModel extends Model<IStoreDocument, IStoreMethods> {
	populateAll(): Promise<IStoreModel>;
}

// StoreSchema.plugin(uniqueValidator, { message: "{PATH} já está em uso." });

StoreSchema.methods.toJSON = function (): TStore {
	const barber = this.toObject();

	return barber;
};

StoreSchema.methods.populateAll = async function (): Promise<IStoreDocument> {
	// await this.populate("avatar");

	return this as IStoreDocument;
};

StoreSchema.pre("save", async function (next) {
	// const barber = this;

	next();
});

const StoreModel: IStoreModel = model<IStoreDocument, IStoreModel>(
	Collections.Stores,
	StoreSchema
);

export { StoreSchema, TStore, IStoreDocument, IStoreModel, StoreModel };
