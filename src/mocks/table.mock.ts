import { TTable } from "types";

export const create_mock_table: (
	opt?: Partial<TTable>
) => Partial<Omit<TTable, "_id">> = (opt) => ({
	...opt,
});
