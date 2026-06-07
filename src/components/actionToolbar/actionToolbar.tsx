import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBadges } from "./components/FilterBadges";
import { SearchInput } from "./components/SearchInput";
import { WishlistSelector } from "./components/WishlistSelector";
import { FilterMenus } from "./components/FilterMenus";
import { ActionButtons } from "./components/ActionButtons";
import { ApplyButton } from "./components/ApplyButton";

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
	selectedWishlist?: string;
	onWishlistChange?: (wishlistId: string) => void;
	onUndo?: () => void;
	undoCount?: number;
	onWishlistCountChange?: (count: number) => void;
	onWishlistsLoadingChange?: (loading: boolean) => void;
	searchInputRef?: React.Ref<HTMLInputElement>;
}

export function ActionToolbar({
	search,
	setSearch,
	filters,
	setFilters,
	selectedWishlist: externalSelectedWishlist,
	onWishlistChange,
	onUndo,
	undoCount = 0,
	onWishlistCountChange,
	onWishlistsLoadingChange,
	searchInputRef,
}: SearchAndFilterToolbarProps) {
	const isMobile = useIsMobile();
	const [priceRange, setPriceRange] = useState<[number, number]>([10, 75]);
	const [internalSelectedWishlist, setInternalSelectedWishlist] =
		useState<string>("");
	const [inputValue, setInputValue] = useState(search);
	const [localFilters, setLocalFilters] = useState(filters);
	const [showApply, setShowApply] = useState(false);
	const undoBtnRef = useRef<HTMLButtonElement>(null);
	const clearFiltersBtnRef = useRef<HTMLButtonElement>(null);

	// Use external state if provided, otherwise use internal state
	const selectedWishlist = externalSelectedWishlist ?? internalSelectedWishlist;
	const setSelectedWishlist = useCallback(
		(value: string) => {
			if (onWishlistChange) {
				onWishlistChange(value);
			} else {
				setInternalSelectedWishlist(value);
			}
		},
		[onWishlistChange]
	);

	useEffect(() => {
		setInputValue(search);
	}, [search]);

	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	useEffect(() => {
		const hasChanges =
			inputValue !== search ||
			localFilters.condition !== filters.condition ||
			localFilters.category !== filters.category ||
			localFilters.minPrice !== filters.minPrice ||
			localFilters.maxPrice !== filters.maxPrice;

		setShowApply(hasChanges);
	}, [inputValue, search, localFilters, filters]);

	const clearCondition = () => {
		setLocalFilters({ ...localFilters, condition: undefined });
	};

	const clearCategory = () => {
		setLocalFilters({ ...localFilters, category: undefined });
	};

	const clearPrice = () => {
		setLocalFilters({
			...localFilters,
			minPrice: undefined,
			maxPrice: undefined,
		});
		setPriceRange([10, 75]);
	};

	const clearSearch = () => {
		setInputValue("");
	};

	const clearAllFilters = () => {
		setLocalFilters({
			condition: undefined,
			category: undefined,
			minPrice: undefined,
			maxPrice: undefined,
		});
		setPriceRange([10, 75]);
	};

	function animateIcon(ref: React.RefObject<HTMLButtonElement | null>) {
		if (!ref.current) return;
		ref.current.classList.add("animate-bounce-in");
		setTimeout(() => {
			if (ref.current) ref.current.classList.remove("animate-bounce-in");
		}, 500);
	}

	const handleApply = () => {
		setSearch(inputValue);
		setFilters(localFilters);
		setShowApply(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleApply();
		}
	};

	const hasActiveFilters =
		!!localFilters.condition ||
		!!localFilters.category ||
		localFilters.minPrice !== undefined ||
		localFilters.maxPrice !== undefined;

	return (
		<div
			className={`bg-background relative z-10 flex w-full max-w-xl flex-col items-stretch rounded-xl border-2 border-fuchsia-400 transition-colors duration-200 sm:max-w-lg md:max-w-2xl lg:max-w-2xl xl:max-w-2xl 2xl:max-w-3xl`}
		>
			{!isMobile && (
				<FilterBadges
					filters={localFilters}
					onClearCondition={clearCondition}
					onClearCategory={clearCategory}
					onClearPrice={clearPrice}
				/>
			)}
			<SearchInput
				value={inputValue}
				onChange={setInputValue}
				onKeyDown={handleKeyDown}
				onClear={clearSearch}
				inputRef={searchInputRef}
			/>
			<div className="mt-1 mb-1 flex w-full flex-col gap-1 px-2 text-base md:flex-row md:flex-wrap md:items-center md:gap-2 md:px-0">
				<div className="w-full md:w-auto">
					<WishlistSelector
						value={selectedWishlist}
						onChange={setSelectedWishlist}
						onWishlistCountChange={onWishlistCountChange}
						onLoadingChange={onWishlistsLoadingChange}
					/>
				</div>

				<div className="flex min-w-0 flex-1 items-center justify-between border-t border-fuchsia-400/20 pt-1 md:flex-wrap md:justify-start md:border-t-0 md:pt-0">
					<FilterMenus
						isMobile={isMobile}
						filters={localFilters}
						setFilters={setLocalFilters}
						priceRange={priceRange}
						setPriceRange={setPriceRange}
					/>

					<ActionButtons
						isMobile={isMobile}
						undoBtnRef={undoBtnRef}
						clearFiltersBtnRef={clearFiltersBtnRef}
						onClearAllFilters={clearAllFilters}
						onUndo={onUndo || (() => {})}
						animateIcon={animateIcon}
						undoCount={undoCount}
						hasActiveFilters={hasActiveFilters}
					/>
				</div>
			</div>
			<ApplyButton
				showApply={showApply}
				isMobile={isMobile}
				onApply={handleApply}
			/>
		</div>
	);
}
