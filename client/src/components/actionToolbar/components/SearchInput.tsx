import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	onClear: () => void;
}

export function SearchInput({
	value,
	onChange,
	onKeyDown,
	onClear,
}: SearchInputProps) {
	return (
		<div className="flex items-center gap-2 px-2">
			<div className="relative flex-1">
				<Input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder="Search listings..."
					className="border-none bg-transparent pr-12 shadow-none focus:border-none focus:ring-0"
				/>
				{value && (
					<button
						onClick={onClear}
						className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-gray-200"
						style={{ zIndex: 21 }}
					>
						<X size={14} className="text-gray-500" />
					</button>
				)}
			</div>
		</div>
	);
}
