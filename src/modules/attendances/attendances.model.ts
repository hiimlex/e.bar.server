import { timestamps } from "@core/config";
import {
	Document,
	InferSchemaType,
	model,
	Model,
	Schema,
	Types,
} from "mongoose";
import { Collections } from "types";

enum AttendanceStatus {
	OPEN = "OPEN",
	CANCELLED = "CANCELLED",
	CLOSED = "CLOSED",
}

const AttendanceSchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
			required: true,
		},
		store: {
			type: Schema.Types.ObjectId,
			ref: Collections.Stores,
			required: true,
		},
		started_at: {
			type: Date,
			required: true,
			default: Date.now,
		},
		closed_at: {
			type: Date,
		},
		tables_count: {
			type: Number,
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		status: {
			type: String,
			enum: [
				AttendanceStatus.OPEN,
				AttendanceStatus.CLOSED,
				AttendanceStatus.CANCELLED,
			],
			default: AttendanceStatus.OPEN,
		},
		working_at: {
			type: [Schema.Types.ObjectId],
			ref: Collections.Waiters,
		},
	},
	{
		timestamps,
		versionKey: false,
		collection: Collections.Attendances,
	}
);

type TAttendance = InferSchemaType<typeof AttendanceSchema>;

interface IAttendanceDocument extends Document<Types.ObjectId>, TAttendance {}

interface IAttendanceMethods {}

interface IAttendancesModel
	extends Model<IAttendanceDocument, {}, IAttendanceMethods> {}

const AttendancesModel = model<IAttendanceDocument, IAttendancesModel>(
	Collections.Attendances,
	AttendanceSchema
);

export { AttendancesModel, IAttendanceDocument, TAttendance, AttendanceStatus };
