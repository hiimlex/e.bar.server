import { faker } from "@faker-js/faker/.";
import { TCategory } from "types";

export const create_mock_category: () => Omit<
	TCategory,
	"_id" | "store"
> = () => ({
	name: faker.food.ethnicCategory(),
});
