import { Input } from "@/components/ui/input";
import { Undo2, X, DollarSign, Menu, BadgeCheck, Search } from "lucide-react";
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
} from "@/components/ui/menubar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
}

export function ActionToolbar({
	search,
	setSearch,
}: SearchAndFilterToolbarProps) {
	const isMobile = useIsMobile();
	const [priceRange, setPriceRange] = useState<[number, number]>([10, 75]);
	const [selectedWishlist, setSelectedWishlist] = useState<string>("");
	const [inputValue, setInputValue] = useState(search);
	const undoBtnRef = useRef<HTMLButtonElement>(null);
	const resetBtnRef = useRef<HTMLButtonElement>(null);

	function animateIcon(ref: React.RefObject<HTMLButtonElement | null>) {
		if (!ref.current) return;
		ref.current.classList.add("animate-bounce-in");
		setTimeout(() => {
			if (ref.current) ref.current.classList.remove("animate-bounce-in");
		}, 500);
	}

	const handleSearch = () => {
		setSearch(inputValue || "trending");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="flex w-full max-w-xl flex-col items-stretch rounded-xl border-2 border-fuchsia-400 sm:max-w-lg md:max-w-2xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl">
			<div className="flex items-center gap-2 px-2">
				<Input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Search listings..."
					className="flex-1 border-none bg-transparent shadow-none focus:border-none focus:ring-0"
				/>
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
						Wishlist
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
								<MenubarItem>New</MenubarItem>
								<MenubarItem>Used</MenubarItem>
								<MenubarItem>Refurbished</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>
								{isMobile ? <Menu size={18} /> : "Category"}
							</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>Electronics</MenubarItem>
								<MenubarItem>Fashion</MenubarItem>
								<MenubarItem>Home & Garden</MenubarItem>
								<MenubarItem>Toys</MenubarItem>
								<MenubarItem>Collectibles</MenubarItem>
								<MenubarItem>Other</MenubarItem>
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
										onValueChange={(vals: number[]) =>
											setPriceRange([vals[0], vals[1] ?? vals[0]])
										}
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
								className="flex items-center rounded align-middle transition duration-150 hover:text-amber-300"
								aria-label="Undo Last Action"
								onClick={() => animateIcon(undoBtnRef)}
							>
								<Undo2 className="inline-block align-middle" size={20} />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Undo Last Action</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								type="button"
								ref={resetBtnRef}
								className="roundedalign-middle mr-2 flex items-center transition duration-150 hover:text-red-500"
								aria-label="Reset Filters"
								onClick={() => animateIcon(resetBtnRef)}
							>
								<X className="inline-block align-middle" size={20} />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Reset Filters</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
