import { faker } from "@faker-js/faker/.";
import { generate_random_code } from "@utils/generate_random_code";
import { TAttendance, TAttendanceStatus } from "types";

export const create_mock_attendance: (
	opt?: Partial<TAttendance>
) => Partial<Omit<TAttendance, "_id">> = (opt) => ({
	code: generate_random_code(),
	tables_count: +faker.number.binary(),
	status: TAttendanceStatus.CLOSED,
	...opt,
});
