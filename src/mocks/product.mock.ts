import { TProduct } from "@modules";
import { Types } from "mongoose";
import { mockStoreId } from "./store.mock";
import { mockCategoryId } from "./category.mock";

export const mockProductId = new Types.ObjectId();

export const mockProduct: TProduct = {
	_id: mockProductId,
	category_id: mockCategoryId,
	store_id: mockStoreId,
	description: "Description",
	name: "Product Mock",
	picture: "https://example.com",
	price: 100,
	quantity: 10,
	createdAt: new Date(),
	enabled: true,
	updatedAt: new Date(),
};
