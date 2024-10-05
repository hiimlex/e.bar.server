import { timestamps } from "@core/index";
import { AttendancesModel } from "@modules/attendances";
import { FileSchema } from "@modules/cloudinary";
import {
	Document,
	InferSchemaType,
	Model,
	Schema,
	Types,
	model,
} from "mongoose";
import { Collections, TAttendanceStatus } from "types";
import { AddressSchema } from "../address";

const StoreSchema = new Schema(
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
		bio: {
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
		avatar: {
			type: FileSchema,
		},
		thumbnail: {
			type: FileSchema,
		},
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
		timestamps,
		collection: Collections.Stores,
	}
);

type TStore = InferSchemaType<typeof StoreSchema>;

interface IStoreDocument extends Document<Types.ObjectId>, TStore {
	populate_all(): Promise<IStoreDocument>;
	has_active_attendance(): Promise<boolean>;
}

interface IAttendanceMethods {}

interface IStoreMethods {
	populate_all(): Promise<IStoreDocument>;
	has_active_attendance(): Promise<boolean>;
}

interface IStoresModel extends Model<IStoreDocument, {}, IStoreMethods> {
	// populateAll(): Promise<IStoresModel>;
}

// StoreSchema.plugin(uniqueValidator, { message: "{PATH} já está em uso." });

StoreSchema.methods.toJSON = function (): TStore {
	const { password, ...store } = this.toObject();

	return store;
};

StoreSchema.methods.populate_all = async function (): Promise<IStoreDocument> {
	// await this.populate("avatar");

	return this as IStoreDocument;
};

StoreSchema.methods.has_active_attendance =
	async function (): Promise<boolean> {
		const store = this as IStoreDocument;

		const attendance = await AttendancesModel.findOne({
			store: store._id,
			status: TAttendanceStatus.OPEN,
		});

		return !!attendance;
	};

StoreSchema.pre("save", async function (next) {
	// const store = this;

	next();
});

const StoresModel: IStoresModel = model<IStoreDocument, IStoresModel>(
	Collections.Stores,
	StoreSchema
);

export { IStoreDocument, IStoresModel, StoresModel, TStore };
