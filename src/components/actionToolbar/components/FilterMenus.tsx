import { Check, DollarSign, Menu } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
	const triggerClassName =
		"relative h-8 min-w-8 justify-center rounded-full px-2 text-xs md:h-auto md:rounded-sm md:px-2 md:text-sm";
	const activeClassName =
		"bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-fuchsia-300/40";

	return (
		<Menubar className="flex h-8 min-w-0 flex-none items-center gap-1 rounded-full border-none bg-muted/40 p-0 align-middle text-base shadow-none md:h-9 md:flex-1 md:rounded-b-xl md:bg-transparent md:p-1">
			<MenubarMenu>
				<MenubarTrigger
					className={cn(
						triggerClassName,
						filters.condition && activeClassName
					)}
					aria-label="Condition filter"
				>
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
				<MenubarTrigger
					className={cn(
						triggerClassName,
						filters.category && activeClassName
					)}
					aria-label="Category filter"
				>
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
				<MenubarTrigger
					className={cn(
						triggerClassName,
						(filters.minPrice !== undefined || filters.maxPrice !== undefined) &&
							activeClassName
					)}
					aria-label="Price filter"
				>
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
