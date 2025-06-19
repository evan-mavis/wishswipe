import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ListingReorderControlsProps {
	onCancel: (e: React.MouseEvent) => void;
	onSave: (e: React.MouseEvent) => void;
}

export function ListingReorderControls({
	onCancel,
	onSave,
}: ListingReorderControlsProps) {
	const isMobile = useIsMobile();

	return (
		<div className="flex gap-2">
			<Button
				variant="ghost"
				size="sm"
				onClick={onCancel}
				className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
			>
				<X className="h-4 w-4" />
				{!isMobile && "Cancel"}
			</Button>
			<Button
				variant="default"
				size="sm"
				onClick={onSave}
				className={cn("gap-2", isMobile && "h-8 w-8 p-0")}
			>
				<Check className="h-4 w-4" />
				{!isMobile && "Save Changes"}
			</Button>
		</div>
	);
}
