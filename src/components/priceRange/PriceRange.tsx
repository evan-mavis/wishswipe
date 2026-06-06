import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PriceRangeProps {
	value: [number, number];
	onChange: (value: [number, number]) => void;
	onFiltersChange?: (filters: { minPrice: number; maxPrice: number }) => void;
	label?: string;
	className?: string;
	variant?: "toolbar" | "preferences";
}

export function PriceRange({
	value,
	onChange,
	onFiltersChange,
	label = "Price Range",
	className = "",
	variant = "preferences",
}: PriceRangeProps) {
	const handlePriceChange = (vals: number[]) => {
		const newRange: [number, number] = [vals[0], vals[1] ?? vals[0]];
		onChange(newRange);

		// Update filters if provided (for toolbar)
		if (onFiltersChange) {
			onFiltersChange({
				minPrice: newRange[0],
				maxPrice: newRange[1],
			});
		}
	};

	const handlePresetClick = (range: [number, number]) => {
		onChange(range);

		// Update filters if provided (for toolbar)
		if (onFiltersChange) {
			onFiltersChange({
				minPrice: range[0],
				maxPrice: range[1],
			});
		}
	};

	const buttonClass =
		variant === "toolbar"
			? "rounded bg-fuchsia-500 px-2 py-1 text-xs text-white hover:bg-fuchsia-500/50"
			: "rounded border bg-background px-2 py-1 text-xs hover:bg-accent";

	return (
		<div className={`flex flex-col ${className}`}>
			<Label htmlFor="priceRange" className="mb-2 text-sm text-gray-600">
				{label}
			</Label>
			<Slider
				min={0}
				max={200}
				step={1}
				value={value}
				onValueChange={handlePriceChange}
			/>
			<div className="mt-2 flex justify-between text-sm text-gray-500">
				<span>${value[0]}</span>
				<span>
					${value[1]}
					{value[1] === 200 ? "+" : ""}
				</span>
			</div>
			{/* Quick price preset buttons for common low price ranges */}
			<div className="mt-3 flex flex-wrap gap-1">
				<button
					onClick={() => handlePresetClick([0, 10])}
					className={buttonClass}
				>
					Under $10
				</button>
				<button
					onClick={() => handlePresetClick([0, 25])}
					className={buttonClass}
				>
					Under $25
				</button>
				<button
					onClick={() => handlePresetClick([0, 50])}
					className={buttonClass}
				>
					Under $50
				</button>
				<button
					onClick={() => handlePresetClick([10, 30])}
					className={buttonClass}
				>
					$10-$30
				</button>
			</div>
		</div>
	);
}
