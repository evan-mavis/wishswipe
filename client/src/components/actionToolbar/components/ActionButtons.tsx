import { Button } from "@/components/ui/button";
import { Undo2, X } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonsProps {
	isMobile: boolean;
	undoBtnRef: React.RefObject<HTMLButtonElement | null>;
	clearFiltersBtnRef: React.RefObject<HTMLButtonElement | null>;
	onClearAllFilters: () => void;
	onUndo: () => void;
	animateIcon: (ref: React.RefObject<HTMLButtonElement | null>) => void;
}

export function ActionButtons({
	isMobile,
	undoBtnRef,
	clearFiltersBtnRef,
	onClearAllFilters,
	onUndo,
	animateIcon,
}: ActionButtonsProps) {
	return (
		<>
			{/* Clear All Filters Button - Mobile Only */}
			{isMobile && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							type="button"
							ref={clearFiltersBtnRef}
							className="flex items-center rounded align-middle transition duration-150 hover:text-red-500"
							aria-label="Clear All Filters"
							onClick={() => {
								onClearAllFilters();
								animateIcon(clearFiltersBtnRef);
							}}
						>
							<X className="inline-block align-middle" size={20} />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">Clear All Filters</TooltipContent>
				</Tooltip>
			)}

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						type="button"
						ref={undoBtnRef}
						className="mr-1 flex items-center rounded align-middle transition duration-150 hover:text-amber-300"
						aria-label="Undo Last Dismissal"
						onClick={() => {
							onUndo();
							animateIcon(undoBtnRef);
						}}
					>
						<Undo2 className="inline-block align-middle" size={20} />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">Undo Last Dismissal</TooltipContent>
			</Tooltip>
		</>
	);
}
