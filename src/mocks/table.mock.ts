import { TTable } from "@modules/tables";

export const create_mock_table: (
	opt?: Partial<TTable>
) => Partial<Omit<TTable, "_id">> = (opt) => ({
	seats: 4,
	...opt,
});
