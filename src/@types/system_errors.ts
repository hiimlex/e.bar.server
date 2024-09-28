export enum SystemErrors {
	// General
	ID_NOT_PROVIDED,
	UNAUTHORIZED,
	FORBIDDEN,
	// Auth
	USER_NOT_FOUND,
	INVALID_PASSWORD,
	// Address
	INVALID_CEP,
	// Category
	CATEGORY_NOT_FOUND,
	// Product
	PRODUCT_NOT_FOUND,
	// Store
	STORE_NOT_FOUND,
	STORE_NOT_CREATED,
	// Files
	FILE_NOT_FOUND
}

export type TSystemErrors = keyof typeof SystemErrors;

export interface HTTPError extends Error {
	status: number;
	text: string;
	method: string;
	path: string;
}