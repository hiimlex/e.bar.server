import {
	AttendanceController,
	AuthController,
	CategoriesController,
	ProductsController,
	StoresController,
	TablesController,
	UploadController,
	WaiterOrdersController,
	WaitersController,
} from "@modules";

const auth_controller = new AuthController();
const stores_controller = new StoresController();
const products_controller = new ProductsController();
const categories_controller = new CategoriesController();
const upload_controller = new UploadController();
const tables_controller = new TablesController();
const waiters_controller = new WaitersController();
const attendance_controller = new AttendanceController();
const waiter_orders_controller = new WaiterOrdersController();

export const routers = [
	auth_controller.router,
	stores_controller.router,
	products_controller.router,
	categories_controller.router,
	upload_controller.router,
	tables_controller.router,
	waiters_controller.router,
	attendance_controller.router,
	waiter_orders_controller.router,
];
