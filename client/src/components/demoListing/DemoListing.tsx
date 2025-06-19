import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { MoveLeft, MoveRight } from "lucide-react";
import { useState } from "react";

const DRAG_THRESHOLD = 150;

const translations = {
  english: "Swipe me!",
  spanish: "¡Deslízame!",
  japanese: "スワイプして!",
  french: "Balayez-moi!",
  german: "Schiebe mich!",
  korean: "스와이프!",
} as const;

function WaveText({ text }: { text: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-fuchsia-400 bg-[length:200%_100%] animate-keyboard-wave"
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
}

export function DemoListing() {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const languages = Object.values(translations);
  const x = useMotionValue(0);
  const opacity = useTransform(
    x,
    [-DRAG_THRESHOLD, 0, DRAG_THRESHOLD],
    [0.2, 1, 0.2]
  );
  const rotate = useTransform(x, [-DRAG_THRESHOLD, DRAG_THRESHOLD], [-15, 15]);

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > DRAG_THRESHOLD) {
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
      dragElastic={0.7}
      className="cursor-grab active:cursor-grabbing"
      onDragEnd={handleDragEnd}
    >
      <div className="w-[400px] h-[400px] bg-card flex items-center justify-between rounded-xl border border-border px-12">
        <MoveLeft size={32} className="text-muted-foreground" />
        <WaveText text={languages[currentLangIndex]} />
        <MoveRight size={32} className="text-muted-foreground" />
      </div>
    </motion.div>
  );
}
