export enum Endpoints {
	// Auth
	AuthLogin = "/auth/login",
	AuthSignup = "/auth/signup",

	// Store
	StoreCreate = "/stores",
	StoreList = "/stores",
	StoreListById = "/stores/:id",
	StoreUpdate = "/stores/:id",
	StoreDelete = "/stores/:id",

	StoreListProducts = "/stores/products",
	StoreProfile = "/stores/profile",

	// Products
	ProductCreate = "/products",
	ProductList = "/products",
	ProductListById = "/products/:id",
	ProductUpdate = "/products/:id",
	ProductDelete = "/products/:id",

	// Categories
	CategoryCreate = "/categories",
	CategoryList = "/categories",
	CategoryListByStoreId = "/categories/:storeId",
	CategoryUpdate = "/categories/:id",
	CategoryDelete = "/categories/:id",

	// Waiters
	WaiterCreate = "/waiters",
	WaiterList = "/waiters",
	WaiterListById = "/waiters/:id",
	WaiterUpdate = "/waiters/:id",
	WaiterDelete = "/waiters/:id",

	// Orders
	OrderCreate = "/orders",
	OrderList = "/orders",
	OrderListById = "/orders/:id",
	OrderUpdate = "/orders/:id",
	OrderDelete = "/orders/:id",

	// Payments
	PaymentCreate = "/payments",
	PaymentList = "/payments",
	PaymentListById = "/payments/:id",
	PaymentUpdate = "/payments/:id",

	// Tables
	TableCreate = "/tables",
	TableList = "/tables",
	TableListById = "/tables/:id",
	TableUpdate = "/tables/:id",
}
