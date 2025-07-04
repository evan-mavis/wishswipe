import { DollarSign, Menu, Check } from "lucide-react";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarRadioGroup,
	MenubarRadioItem,
} from "@/components/ui/menubar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

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
						<MenubarRadioItem value="new">New</MenubarRadioItem>
						<MenubarRadioItem value="used">Used</MenubarRadioItem>
						<MenubarRadioItem value="refurbished">Refurbished</MenubarRadioItem>
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
						<MenubarRadioItem value="11450">
							Clothing, Shoes & Accessories
						</MenubarRadioItem>
						<MenubarRadioItem value="26395">Health & Beauty</MenubarRadioItem>
						<MenubarRadioItem value="220">Toys & Hobbies</MenubarRadioItem>
						<MenubarRadioItem value="267">Books & Magazines</MenubarRadioItem>
						<MenubarRadioItem value="281">Jewelry & Watches</MenubarRadioItem>
						<MenubarRadioItem value="293">
							Consumer Electronics
						</MenubarRadioItem>
						<MenubarRadioItem value="619">
							Musical Instruments & Gear
						</MenubarRadioItem>
						<MenubarRadioItem value="625">Cameras & Photo</MenubarRadioItem>
						<MenubarRadioItem value="870">Pottery & Glass</MenubarRadioItem>
						<MenubarRadioItem value="888">Sporting Goods</MenubarRadioItem>
						<MenubarRadioItem value="1249">
							Video Games & Consoles
						</MenubarRadioItem>
						<MenubarRadioItem value="3252">Travel</MenubarRadioItem>
						<MenubarRadioItem value="11700">Home & Garden</MenubarRadioItem>
						<MenubarRadioItem value="99">Everything Else...</MenubarRadioItem>
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger className="flex items-center align-middle text-sm">
					{isMobile ? <DollarSign size={18} /> : "Price"}
				</MenubarTrigger>
				<MenubarContent>
					<div className="flex flex-col">
						<Label htmlFor="priceRange" className="mb-2 text-sm text-gray-600">
							Price Range
						</Label>
						<Slider
							min={0}
							max={200}
							step={1} // Changed from 5 to 1 for more granular control
							value={priceRange}
							onValueChange={(vals: number[]) => {
								const newRange: [number, number] = [
									vals[0],
									vals[1] ?? vals[0],
								];
								setPriceRange(newRange);
								setFilters({
									...filters,
									minPrice: newRange[0],
									maxPrice: newRange[1],
								});
							}}
						/>
						<div className="mt-2 flex justify-between text-sm text-gray-500">
							<span>${priceRange[0]}</span>
							<span>
								${priceRange[1]}
								{priceRange[1] === 200 ? "+" : ""}
							</span>
						</div>
						{/* Add quick price preset buttons for common low price ranges */}
						<div className="mt-3 flex flex-wrap gap-1">
							<button
								onClick={() => {
									setPriceRange([0, 10]);
									setFilters({ ...filters, minPrice: 0, maxPrice: 10 });
								}}
								className="rounded bg-fuchsia-500 px-2 py-1 text-xs hover:bg-fuchsia-500/50"
							>
								Under $10
							</button>
							<button
								onClick={() => {
									setPriceRange([0, 25]);
									setFilters({ ...filters, minPrice: 0, maxPrice: 25 });
								}}
								className="rounded bg-fuchsia-500 px-2 py-1 text-xs hover:bg-fuchsia-500/50"
							>
								Under $25
							</button>
							<button
								onClick={() => {
									setPriceRange([0, 50]);
									setFilters({ ...filters, minPrice: 0, maxPrice: 50 });
								}}
								className="rounded bg-fuchsia-500 px-2 py-1 text-xs hover:bg-fuchsia-500/50"
							>
								Under $50
							</button>
							<button
								onClick={() => {
									setPriceRange([10, 30]);
									setFilters({ ...filters, minPrice: 10, maxPrice: 30 });
								}}
								className="rounded bg-fuchsia-500 px-2 py-1 text-xs hover:bg-fuchsia-500/50"
							>
								$10-$30
							</button>
						</div>
					</div>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
