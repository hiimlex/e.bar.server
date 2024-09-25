import { TProduct } from "@modules";
import { Types } from "mongoose";

export const mockProduct: TProduct = {
	category: new Types.ObjectId(),
	description: "Description",
	_id: new Types.ObjectId(),
	name: "Product Mock",
	picture: "https://example.com",
	price: 100,
	quantity: 10,
	createdAt: new Date(),
	enabled: true,
	store_id: new Types.ObjectId(),
	updatedAt: new Date(),
};
