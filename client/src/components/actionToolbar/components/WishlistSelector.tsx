import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";

interface WishlistSelectorProps {
	value: string;
	onChange: (value: string) => void;
}

export function WishlistSelector({ value, onChange }: WishlistSelectorProps) {
	return (
		<div className="ml-2 flex min-w-[0] items-center gap-2">
			<Label
				htmlFor="wishlist-select"
				className="ml-3 hidden text-sm whitespace-nowrap text-gray-600 sm:inline"
			>
				Wishlist:
			</Label>
			<Select value={value} onValueChange={onChange}>
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
	);
}
