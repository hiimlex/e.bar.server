import { AttendanceSchema } from "@modules/attendances";
import { InferSchemaType, Types, Document, Model } from "mongoose";
import { ISortFilter } from "./generic.model";

export type TAttendance = InferSchemaType<typeof AttendanceSchema>;

export interface IAttendanceDocument
	extends Document<Types.ObjectId>,
		TAttendance {}

export interface IAttendanceMethods {}

export interface IAttendancesModel
	extends Model<IAttendanceDocument, {}, IAttendanceMethods> {}

export enum TAttendanceStatus {
	OPEN = "OPEN",
	CANCELLED = "CANCELLED",
	CLOSED = "CLOSED",
}

export interface IListAttendancesFilters extends ISortFilter<'created_at'> {
	status?: TAttendanceStatus;
}