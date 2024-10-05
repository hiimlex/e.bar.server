import { timestamps } from "@core/config";
import { model, Schema } from "mongoose";
import { Collections } from "types";
import {
	IAttendanceDocument,
	IAttendancesModel,
	TAttendanceStatus,
} from "types/attendances.model";

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
				TAttendanceStatus.OPEN,
				TAttendanceStatus.CLOSED,
				TAttendanceStatus.CANCELLED,
			],
			default: TAttendanceStatus.OPEN,
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

const AttendancesModel = model<IAttendanceDocument, IAttendancesModel>(
	Collections.Attendances,
	AttendanceSchema
);

export { AttendanceSchema, AttendancesModel };
