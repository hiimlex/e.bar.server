export enum Endpoints {
	// Auth
	AuthLogin = "/api/auth/login",
	AuthMe = "/api/auth/me",
	AuthSignup = "/api/auth/signup",
	AuthGetStore = "/api/auth/get-store",
	AuthGetWaiter = "/api/auth/get-waiter",
	AuthIsAuthenticated = "/api/auth/is-authenticated",

	// Store
	StoreCreate = "/api/stores",
	StoreUpdateAvatar = "/api/stores/avatar",
	StoreUpdateThumbnail = "/api/stores/thumbnail",
	StoreList = "/api/stores",
	StoreListById = "/api/stores/:id",
	StoreUpdate = "/api/stores/:id",
	StoreDelete = "/api/stores/:id",

	StoreListProducts = "/api/stores/products",
	StoreProfile = "/api/stores/profile",

	// Products
	ProductCreate = "/api/products",
	ProductList = "/api/products",
	ProductListById = "/api/products/:id",
	ProductUpdate = "/api/products/:id",
	ProductDelete = "/api/products/:id",

	// Categories
	CategoryCreate = "/api/categories",
	CategoryList = "/api/categories",
	CategoryListByStoreId = "/api/categories/:store_id",
	CategoryUpdate = "/api/categories/:id",
	CategoryDelete = "/api/categories/:id",

	// Waiters
	WaiterCreate = "/api/waiters",
	WaiterList = "/api/waiters",
	WaiterProfile = "/api/waiters/profile",
	WaiterUpdateProfile = "/api/waiters/profile/update",
	WaiterListById = "/api/waiters/:id",
	WaiterUpdate = "/api/waiters/:id",
	WaiterDelete = "/api/waiters/:id",

	// Waiter Orders
	WaiterOrderCreate = "/api/w-orders",
	WaiterOrderList = "/api/w-orders",
	WaiterOrderShowById = "/api/w-orders/:id",
	WaiterOrderUpdate = "/api/w-orders/:id",
	WaiterOrderCancel = "/api/w-orders/cancel/:id",
	WaiterOrderFinish = "/api/w-orders/finish/:id",
	
	

	// Payments
	PaymentCreate = "/api/payments",
	PaymentList = "/api/payments",
	PaymentListById = "/api/payments/:id",
	PaymentUpdate = "/api/payments/:id",

	// Tables
	TableCreate = "/api/tables",
	TableList = "/api/tables",
	TableListById = "/api/tables/:id",
	TableUpdate = "/api/tables/:id",
	TableDelete = "/api/tables/:id",

	// Test
	TestUpload = "/api/test/upload",

	// Attendances 
	AttendanceCreate = "/api/attendances",
	AttendanceList = "/api/attendances",
	AttendanceListById = "/api/attendances/:id",
	AttendanceUpdate = "/api/attendances/:id",
	AttendanceGetByCode = "/api/attendances/code/:code",
	AttendanceValidateCode = "/api/attendances/validate/:code",
}
