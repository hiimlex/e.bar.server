export const Months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const SALT_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || "e.bar";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
export const DEFAULT_CODE_LEN = 6;
export const COOKIE_MAX_AGE = 1000 * 360 * 24;
export const ATTENDANCE_COOKIE_NAME = "e.bar.attendance";

export const DEFAULT_SERVER_ERROR = {
	statusCode: 500,
	message: "An error occurred",
};
