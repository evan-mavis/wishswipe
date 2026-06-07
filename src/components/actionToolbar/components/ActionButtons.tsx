import { Button } from "@/components/ui/button";
import { Undo2, X } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
	isMobile: boolean;
	undoBtnRef: React.RefObject<HTMLButtonElement | null>;
	clearFiltersBtnRef: React.RefObject<HTMLButtonElement | null>;
	onClearAllFilters: () => void;
	onUndo: () => void;
	animateIcon: (ref: React.RefObject<HTMLButtonElement | null>) => void;
	undoCount: number;
	hasActiveFilters: boolean;
}

export function ActionButtons({
	isMobile,
	undoBtnRef,
	clearFiltersBtnRef,
	onClearAllFilters,
	onUndo,
	animateIcon,
	undoCount,
	hasActiveFilters,
}: ActionButtonsProps) {
	return (
		<div className="flex items-center gap-1">
			{isMobile && hasActiveFilters && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							type="button"
							ref={clearFiltersBtnRef}
							className="flex h-8 w-8 items-center rounded-full p-0 align-middle transition duration-150 hover:text-red-500"
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
						disabled={undoCount === 0}
						className={cn(
							"mr-1 flex items-center rounded align-middle transition duration-150 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50",
							isMobile && "mr-0 h-8 w-8 rounded-full p-0"
						)}
						aria-label={`Undo Last Dismissal (${undoCount} available)`}
						onClick={() => {
							onUndo();
							animateIcon(undoBtnRef);
						}}
					>
						<Undo2 className="inline-block align-middle" size={20} />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					{undoCount > 0
						? `Undo Last Dismissal (${undoCount} available)`
						: "No dismissals to undo"}
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
