export enum SystemErrors {
	USER_NOT_FOUND,
	INVALID_CEP,
	STORE_NOT_FOUND,
	ID_NOT_PROVIDED,
	CATEGORY_NOT_FOUND,
	PRODUCT_NOT_FOUND,
}

export type TSystemErrors = keyof typeof SystemErrors;
