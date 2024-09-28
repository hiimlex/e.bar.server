export enum Endpoints {
	// Auth
	AuthLogin = "/api/auth/login",
	AuthSignup = "/api/auth/signup",
	AuthGetStore = "/api/auth/get-store",
	AuthIsAuthenticated = "/api/auth/is-authenticated",

	// Store
	StoreCreate = "/api/stores",
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
	WaiterListById = "/api/waiters/:id",
	WaiterUpdate = "/api/waiters/:id",
	WaiterDelete = "/api/waiters/:id",

	// Orders
	OrderCreate = "/api/orders",
	OrderList = "/api/orders",
	OrderListById = "/api/orders/:id",
	OrderUpdate = "/api/orders/:id",
	OrderDelete = "/api/orders/:id",

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
}
