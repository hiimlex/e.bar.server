import { TStore } from "@modules/stores";
import { Types } from "mongoose";

export const mockStore: TStore = {
	name: "Store Name",
	bio: "Store Bio",
	phone: "Store Phone",
	email: "Store Email",
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
};
