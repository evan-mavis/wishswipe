import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface ApplyButtonProps {
	showApply: boolean;
	isMobile: boolean;
	onApply: () => void;
}

export function ApplyButton({
	showApply,
	isMobile,
	onApply,
}: ApplyButtonProps) {
	return (
		<>
			{showApply && (
				<AnimatePresence>
					<motion.div
						className="flex w-full justify-end"
						style={{
							position: "static",
							overflow: "visible",
							transformOrigin: "top",
						}}
						initial={{ opacity: 0, scaleY: 0 }}
						animate={{ opacity: 1, scaleY: 1 }}
						exit={{ opacity: 0, scaleY: 0 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
					>
						<button
							onClick={onApply}
							aria-label="Apply & Search"
							className="flex h-6 items-center justify-center rounded-tl-none rounded-tr-none rounded-b-xl border-2 border-t-0 border-fuchsia-600 bg-fuchsia-600 text-[0.65rem] font-semibold text-white shadow transition-colors duration-200 hover:bg-fuchsia-700 md:h-7 md:min-w-[90px]"
							style={{
								position: "absolute",
								right: "10px",
								bottom: isMobile ? "-26px" : "-30px",
								maxWidth: "120px",
								zIndex: 10,
							}}
						>
							<span className="flex w-full items-center justify-center md:hidden">
								<Check size={18} />
							</span>
							<span className="hidden items-center whitespace-nowrap md:flex">
								Apply & Search
								<Check size={16} className="ml-1" />
							</span>
						</button>
					</motion.div>
				</AnimatePresence>
			)}
		</>
	);
}
