import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ListingReorderControlsProps {
	onCancel: (e: React.MouseEvent) => void;
	onSave: (e: React.MouseEvent) => void;
}

export function ListingReorderControls({
	onCancel,
	onSave,
}: ListingReorderControlsProps) {
	return (
		<div className="flex gap-2">
			<Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
				<X className="h-4 w-4" />
				Cancel
			</Button>
			<Button variant="default" size="sm" onClick={onSave} className="gap-2">
				<Check className="h-4 w-4" />
				Save Changes
			</Button>
		</div>
	);
}
