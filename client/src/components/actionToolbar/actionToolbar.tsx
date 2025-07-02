import { Input } from "@/components/ui/input";
import { Undo2, X, DollarSign, Menu, BadgeCheck, Search } from "lucide-react";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarRadioGroup,
	MenubarRadioItem,
} from "@/components/ui/menubar";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getConditionDisplayName,
	getCategoryDisplayName,
	getPriceDisplayName,
} from "./filterHelpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { Slider } from "@/components/ui/slider";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";

interface SearchAndFilterToolbarProps {
	search: string;
	setSearch: (value: string) => void;
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
}

export function ActionToolbar({
	search,
	setSearch,
	filters,
	setFilters,
}: SearchAndFilterToolbarProps) {
	const isMobile = useIsMobile();
	const [priceRange, setPriceRange] = useState<[number, number]>([10, 75]);
	const [selectedWishlist, setSelectedWishlist] = useState<string>("");
	const [inputValue, setInputValue] = useState(search);
	const undoBtnRef = useRef<HTMLButtonElement>(null);

	// Clear individual filter functions
	const clearCondition = () => {
		setFilters({ ...filters, condition: undefined });
	};

	const clearCategory = () => {
		setFilters({ ...filters, category: undefined });
	};

	const clearPrice = () => {
		setFilters({ ...filters, minPrice: undefined, maxPrice: undefined });
		setPriceRange([10, 75]); // Reset price range to default
	};

	const clearSearch = () => {
		setInputValue("");
		setSearch("");
	};

	function animateIcon(ref: React.RefObject<HTMLButtonElement | null>) {
		if (!ref.current) return;
		ref.current.classList.add("animate-bounce-in");
		setTimeout(() => {
			if (ref.current) ref.current.classList.remove("animate-bounce-in");
		}, 500);
	}

	const handleSearch = () => {
		setSearch(inputValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="flex w-full max-w-xl flex-col items-stretch rounded-xl border-2 border-fuchsia-400 sm:max-w-lg md:max-w-2xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl">
			{/* Active Filter Badges */}
			<div className="flex flex-wrap justify-center gap-1 p-2">
				{getConditionDisplayName(filters.condition) && (
					<Badge
						variant="secondary"
						className="border-fuchsia-600 bg-fuchsia-300 text-xs text-white"
					>
						Condition: {getConditionDisplayName(filters.condition)}
						<button
							onClick={clearCondition}
							className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
						>
							<X size={12} />
						</button>
					</Badge>
				)}
				{getCategoryDisplayName(filters.category) && (
					<Badge
						variant="secondary"
						className="border-fuchsia-600 bg-fuchsia-300 text-xs text-white"
					>
						Category: {getCategoryDisplayName(filters.category)}
						<button
							onClick={clearCategory}
							className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
						>
							<X size={12} />
						</button>
					</Badge>
				)}
				{getPriceDisplayName(filters) && (
					<Badge
						variant="secondary"
						className="border-fuchsia-600 bg-fuchsia-300 text-xs text-white"
					>
						Price: {getPriceDisplayName(filters)}
						<button
							onClick={clearPrice}
							className="ml-1 rounded-full p-0.5 transition-colors hover:bg-fuchsia-600"
						>
							<X size={12} />
						</button>
					</Badge>
				)}
			</div>
			<div className="flex items-center gap-2 px-2">
				<div className="relative flex-1">
					<Input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Search listings..."
						className="border-none bg-transparent pr-8 shadow-none focus:border-none focus:ring-0"
					/>
					{inputValue && (
						<button
							onClick={clearSearch}
							className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-gray-200"
						>
							<X size={14} className="text-gray-500" />
						</button>
					)}
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={handleSearch}
							variant="ghost"
							size="sm"
							className="px-3 transition duration-150 hover:text-green-500"
						>
							<Search size={16} />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Search Listings</TooltipContent>
				</Tooltip>
			</div>
			<div className="mt-1 mb-1 flex w-full flex-wrap items-center gap-2 align-middle text-base">
				<div className="ml-2 flex min-w-[0] items-center gap-2">
					<Label
						htmlFor="wishlist-select"
						className="ml-3 hidden text-sm whitespace-nowrap text-gray-600 sm:inline"
					>
						Wishlist:
					</Label>
					<Select value={selectedWishlist} onValueChange={setSelectedWishlist}>
						<SelectTrigger id="wishlist-select" className="w-[120px]">
							<SelectValue placeholder="Choose..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="main">Main</SelectItem>
							<SelectItem value="birthday">Birthday</SelectItem>
							<SelectItem value="holiday">Holiday</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex min-w-0 flex-1 flex-wrap items-center">
					<Menubar className="flex min-w-0 flex-1 items-center rounded-b-xl border-none bg-transparent align-middle text-base shadow-none">
						<MenubarMenu>
							<MenubarTrigger>
								{isMobile ? <BadgeCheck size={18} /> : "Condition"}
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
									<MenubarRadioItem value="26395">
										Health & Beauty
									</MenubarRadioItem>
									<MenubarRadioItem value="220">
										Toys & Hobbies
									</MenubarRadioItem>
									<MenubarRadioItem value="267">
										Books & Magazines
									</MenubarRadioItem>
									<MenubarRadioItem value="281">
										Jewelry & Watches
									</MenubarRadioItem>
									<MenubarRadioItem value="293">
										Consumer Electronics
									</MenubarRadioItem>
									<MenubarRadioItem value="619">
										Musical Instruments & Gear
									</MenubarRadioItem>
									<MenubarRadioItem value="625">
										Cameras & Photo
									</MenubarRadioItem>
									<MenubarRadioItem value="870">
										Pottery & Glass
									</MenubarRadioItem>
									<MenubarRadioItem value="888">
										Sporting Goods
									</MenubarRadioItem>
									<MenubarRadioItem value="1249">
										Video Games & Consoles
									</MenubarRadioItem>
									<MenubarRadioItem value="3252">Travel</MenubarRadioItem>
									<MenubarRadioItem value="11700">
										Home & Garden
									</MenubarRadioItem>
									<MenubarRadioItem value="99">
										Everything Else...
									</MenubarRadioItem>
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

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								type="button"
								ref={undoBtnRef}
								className="mr-1 flex items-center rounded align-middle transition duration-150 hover:text-amber-300"
								aria-label="Undo Last Dismissal"
								onClick={() => animateIcon(undoBtnRef)}
							>
								<Undo2 className="inline-block align-middle" size={20} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">Undo Last Dismissal</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
