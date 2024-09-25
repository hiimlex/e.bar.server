export enum SystemErrors {
	USER_NOT_FOUND,
	INVALID_CEP,
	STORE_NOT_FOUND,
	ID_NOT_PROVIDED,
}

export type TSystemErrors = keyof typeof SystemErrors;
