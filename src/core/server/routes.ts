import {
	AuthController,
	CategoriesController,
	ProductsController,
	StoresController,
} from "@modules";

const auth_controller = new AuthController();
const stores_controller = new StoresController();
const products_controller = new ProductsController();
const categories_controller = new CategoriesController();

export const routers = [
	auth_controller.router,
	stores_controller.router,
	products_controller.router,
	categories_controller.router,
];
