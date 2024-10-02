import { faker } from "@faker-js/faker/.";
import { TWaiter } from "@modules/waiters";

export const create_mock_waiter: (
	opt?: Partial<TWaiter>
) => Partial<Omit<TWaiter, "_id">> = (opt) => ({
	name: faker.person.fullName(),
	email: faker.internet.email(),
	phone: +faker.number.binary(),
	password: faker.internet.password(),
	...opt,
});
