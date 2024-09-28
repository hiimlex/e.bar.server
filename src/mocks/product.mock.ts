import { faker } from "@faker-js/faker/.";
import { TProduct } from "@modules";
import { Types } from "mongoose";

export const create_mock_product: () => Omit<TProduct, "_id"> = () => ({
	category: new Types.ObjectId(),
	store: new Types.ObjectId(),
	description: faker.lorem.lines(),
	name: faker.commerce.productName(),
	picture: {
		url: faker.image.url(),
		original_name: faker.system.fileName(),
	},
	price: +faker.commerce.price(),
	quantity: +faker.commerce.price(),
	createdAt: new Date(),
	enabled: true,
	updatedAt: new Date(),
});
