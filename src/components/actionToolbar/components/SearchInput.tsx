import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	onClear: () => void;
	inputRef?: React.Ref<HTMLInputElement>;
}

export function SearchInput({
	value,
	onChange,
	onKeyDown,
	onClear,
	inputRef,
}: SearchInputProps) {
	const handleChange = (rawValue: string) => {
		onChange(rawValue);
	};

	return (
		<div className="flex items-center gap-2 px-2 pt-2 md:pt-0">
			<div className="relative flex-1">
				<Search
					size={16}
					className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
				/>
				<Input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => handleChange(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder="Search listings..."
					className="h-9 cursor-text rounded-lg border-fuchsia-400/30 bg-muted/40 pr-10 pl-9 shadow-sm transition-colors hover:border-fuchsia-300 focus-visible:border-fuchsia-300 focus-visible:ring-fuchsia-300/30 md:pr-20"
				/>
				{!value && (
					<kbd className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-border bg-background/70 px-1.5 py-0.5 text-[0.65rem] font-medium md:block">
						⌘ K
					</kbd>
				)}
				{value && (
					<button
						type="button"
						onClick={onClear}
						className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-gray-200"
						aria-label="Clear search"
						style={{ zIndex: 21 }}
					>
						<X size={14} className="text-gray-500" />
					</button>
				)}
			</div>
		</div>
	);
}
