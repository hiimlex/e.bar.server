export enum SystemErrors {
	USER_NOT_FOUND,
	INVALID_CEP,
}

export type TSystemErrors = keyof typeof SystemErrors;
