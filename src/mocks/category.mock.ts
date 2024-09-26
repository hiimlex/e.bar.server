import { TProduct } from "@modules";
import { Types } from "mongoose";
import { mockStoreId } from "./store.mock";
import { TCategory } from "@modules/categories";

export const mockCategoryId = new Types.ObjectId();

export const mockCategory: TCategory = {
	_id: mockCategoryId,
	store_id: mockStoreId,
	name: "Category Mock",
};
