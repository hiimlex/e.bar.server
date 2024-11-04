import { TOrder } from "types";

export const create_mock_order: (
	opt?: Partial<TOrder>
) => Partial<Omit<TOrder, "_id">> = (opt) => ({
	...opt,
});
