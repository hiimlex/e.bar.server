import { IStoreDocument, IWaiterDocument } from "@modules";

export enum Collections {
	Stores = "Stores",
	Products = "Products",
	Categories = "Categories",
	Waiters = "Waiters",
	Orders = "Orders",
	Payments = "Payments",
	Tables = "Tables",
	Attendances = "Attendances",
}

export interface IResponseLocals {
	store: IStoreDocument;
	waiter: IWaiterDocument;
}
