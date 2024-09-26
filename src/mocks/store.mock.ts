import { TStore } from "@modules/stores";
import { Types } from "mongoose";
import { faker } from "@faker-js/faker";

export const create_mock_store: () => TStore = () => ({
	name: faker.person.fullName(),
	email: faker.internet.email(),
	phone: +faker.number.binary(255),
	bio: faker.lorem.paragraph(),
	password: "Store Password",
	address: {
		cep: 12345678,
		street: "Store Street",
		number: 123,
		complement: "Store Complement",
		neighborhood: "Store Neighborhood",
		city: "Store City",
		state: "Store State",
	},
	// avatar: "Store Avatar",
	enabled: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	_id: new Types.ObjectId(),
});
