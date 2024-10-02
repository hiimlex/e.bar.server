export interface IPaginationResponse<T = any> {
	content: T[];
	total_elements?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;

	offset?: number;
	limit?: number;
	next?: boolean;
}
