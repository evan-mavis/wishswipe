interface Filters {
	condition?: string;
	category?: string;
	minPrice?: number;
	maxPrice?: number;
}

export const getConditionDisplayName = (conditionId?: string) => {
	switch (conditionId) {
		case "1000":
			return "New";
		case "2000":
			return "Used";
		case "4000":
			return "Refurbished";
		default:
			return "";
	}
};

export const getCategoryDisplayName = (categoryId?: string) => {
	switch (categoryId) {
		case "11450":
			return "Clothing";
		case "26395":
			return "Health & Beauty";
		case "220":
			return "Toys & Hobbies";
		case "267":
			return "Books & Magazines";
		case "281":
			return "Jewelry & Watches";
		case "293":
			return "Electronics";
		case "619":
			return "Musical Instruments";
		case "625":
			return "Cameras & Photo";
		case "870":
			return "Pottery & Glass";
		case "888":
			return "Sporting Goods";
		case "1249":
			return "Video Games";
		case "3252":
			return "Travel";
		case "11700":
			return "Home & Garden";
		case "99":
			return "Everything Else";
		default:
			return "";
	}
};

export const getPriceDisplayName = (filters: Filters) => {
	if (filters.minPrice && filters.maxPrice) {
		return `$${filters.minPrice}-$${filters.maxPrice}`;
	} else if (filters.minPrice) {
		return `$${filters.minPrice}+`;
	} else if (filters.maxPrice) {
		return `Up to $${filters.maxPrice}`;
	}
	return "";
};
