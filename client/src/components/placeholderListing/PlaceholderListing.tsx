import {
	motion,
	useMotionValue,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// mobile-aware drag threshold - more sensitive on mobile
const getDragThreshold = (isMobile: boolean) => (isMobile ? 80 : 150);

const translations = {
	english: "Swipe me!",
	spanish: "¡Deslízame!",
	japanese: "スワイプして!",
	french: "Balayez-moi!",
	german: "Schiebe mich!",
	korean: "스와이프!",
} as const;

function WaveText({ text }: { text: string }) {
	const isMobile = useIsMobile();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={text}
				initial={{ scale: 1 }}
				animate={{ scale: [1, 1.4, 1] }}
				transition={{ duration: 0.5 }}
				className={`animate-keyboard-wave bg-gradient-to-r from-white to-fuchsia-400 bg-[length:200%_100%] bg-clip-text text-center font-medium text-transparent ${
					isMobile
						? "max-w-[200px] text-sm"
						: "max-w-[280px] text-lg sm:text-xl md:text-2xl"
				}`}
			>
				{text}
			</motion.div>
		</AnimatePresence>
	);
}

interface PlaceholderListingProps {
	text?: string;
	actionButton?: React.ReactNode;
	showArrows?: boolean;
}

export function PlaceholderListing({
	text,
	actionButton,
	showArrows = true,
}: PlaceholderListingProps) {
	const isMobile = useIsMobile();
	const dragThreshold = getDragThreshold(isMobile);
	const [currentLangIndex, setCurrentLangIndex] = useState(0);
	const languages = Object.values(translations);
	const x = useMotionValue(0);
	const opacity = useTransform(
		x,
		[-dragThreshold, 0, dragThreshold],
		[0.2, 1, 0.2]
	);
	const rotate = useTransform(x, [-dragThreshold, dragThreshold], [-15, 15]);

	const handleDragEnd = () => {
		if (Math.abs(x.get()) > dragThreshold) {
			setCurrentLangIndex((prev) => (prev + 1) % languages.length);
		}
	};

	return (
		<motion.div
			style={{ x, opacity, rotate }}
			animate={{
				x: [0, -10, 10, 0],
			}}
			transition={{
				repeat: Infinity,
				duration: 2,
				ease: "easeInOut",
				repeatDelay: 1,
			}}
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={isMobile ? 0.8 : 0.7}
			className="cursor-grab active:cursor-grabbing"
			onDragEnd={handleDragEnd}
		>
			<div
				className={`bg-card border-border flex items-center justify-between rounded-xl border ${
					isMobile ? "h-[280px] w-[280px] px-6" : "h-[400px] w-[400px] px-12"
				}`}
			>
				{showArrows && (
					<MoveLeft
						size={isMobile ? 24 : 32}
						className="text-muted-foreground"
					/>
				)}
				<div className="flex flex-col items-center justify-center">
					<WaveText text={text || languages[currentLangIndex]} />
					{actionButton && <div className="mt-4">{actionButton}</div>}
				</div>
				{showArrows && (
					<MoveRight
						size={isMobile ? 24 : 32}
						className="text-muted-foreground"
					/>
				)}
			</div>
		</motion.div>
	);
}
