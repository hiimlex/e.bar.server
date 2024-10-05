import { IStoreDocument } from "@modules/stores";
import { IWaiterDocument } from "./waiters.model";

export interface IResponseLocals {
	store: IStoreDocument;
	waiter: IWaiterDocument;
}

export interface ISortFilter<T> {
	sort?: "asc" | "desc";
	sort_by?: T;
}
