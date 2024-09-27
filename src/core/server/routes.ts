import {
	AuthController,
	CategoriesController,
	ProductsController,
	StoresController,
	UploadController,
} from "@modules";

const auth_controller = new AuthController();
const stores_controller = new StoresController();
const products_controller = new ProductsController();
const categories_controller = new CategoriesController();
const upload_controller = new UploadController();

export const routers = [
	auth_controller.router,
	stores_controller.router,
	products_controller.router,
	categories_controller.router,
	upload_controller.router,
];
