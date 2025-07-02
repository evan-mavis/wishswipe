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
		<Menubar className="flex min-w-0 flex-1 items-center rounded-b-xl border-none bg-transparent align-middle text-base shadow-none">
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
						<MenubarRadioItem value="1000">New</MenubarRadioItem>
						<MenubarRadioItem value="2000">Used</MenubarRadioItem>
						<MenubarRadioItem value="4000">Refurbished</MenubarRadioItem>
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
						<Label htmlFor="priceRange" className="text-sm text-gray-600">
							Price Range
						</Label>
						<Slider
							min={0}
							max={200}
							step={5}
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
						<div className="flex justify-between text-sm text-gray-500">
							<span>${priceRange[0]}</span>
							<span>${priceRange[1]}+</span>
						</div>
					</div>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
