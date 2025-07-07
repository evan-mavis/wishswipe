import { DollarSign, Menu, Check } from "lucide-react";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarRadioGroup,
	MenubarRadioItem,
} from "@/components/ui/menubar";
import { PriceRange } from "@/components/priceRange/PriceRange";
import { CONDITIONS } from "@/constants/conditions";
import { CATEGORIES } from "@/constants/categories";

interface FilterMenusProps {
	isMobile: boolean;
	filters: {
		condition?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
	};
	setFilters: (filters: {
		condition?: string;
		category?: string;
		minPrice?: number;
		maxPrice?: number;
	}) => void;
	priceRange: [number, number];
	setPriceRange: (range: [number, number]) => void;
}

export function FilterMenus({
	isMobile,
	filters,
	setFilters,
	priceRange,
	setPriceRange,
}: FilterMenusProps) {
	return (
		<Menubar className="flex min-w-0 flex-1 items-center gap-0 rounded-b-xl border-none bg-transparent align-middle text-base shadow-none md:gap-1">
			<MenubarMenu>
				<MenubarTrigger>
					{isMobile ? <Check size={18} /> : "Condition"}
				</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup
						value={filters.condition}
						onValueChange={(value) =>
							setFilters({ ...filters, condition: value })
						}
					>
						{CONDITIONS.map((condition) => (
							<MenubarRadioItem key={condition} value={condition}>
								{condition}
							</MenubarRadioItem>
						))}
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					{isMobile ? <Menu size={18} /> : "Category"}
				</MenubarTrigger>
				<MenubarContent>
					<MenubarRadioGroup
						value={filters.category}
						onValueChange={(value) =>
							setFilters({ ...filters, category: value })
						}
					>
						{CATEGORIES.map((category) => (
							<MenubarRadioItem key={category} value={category}>
								{category}
							</MenubarRadioItem>
						))}
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger className="flex items-center align-middle text-sm">
					{isMobile ? <DollarSign size={18} /> : "Price"}
				</MenubarTrigger>
				<MenubarContent>
					<PriceRange
						value={priceRange}
						onChange={setPriceRange}
						onFiltersChange={(priceFilters) =>
							setFilters({ ...filters, ...priceFilters })
						}
						variant="toolbar"
					/>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
