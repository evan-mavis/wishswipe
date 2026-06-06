import { ChevronLeft, ChevronRight } from "lucide-react";

export function CornersFrame() {
	return (
		<>
			<div className="absolute top-0 left-0">
				<ChevronLeft
					size={40}
					className="text-fuchsia-300"
					style={{ transform: "rotate(45deg)" }}
				/>
			</div>
			<div className="absolute top-0 right-0">
				<ChevronRight
					size={40}
					className="text-fuchsia-300"
					style={{ transform: "rotate(-45deg)" }}
				/>
			</div>
			<div className="absolute bottom-0 left-0">
				<ChevronLeft
					size={40}
					className="text-fuchsia-300"
					style={{ transform: "rotate(-45deg)" }}
				/>
			</div>
			<div className="absolute right-0 bottom-0">
				<ChevronRight
					size={40}
					className="text-fuchsia-300"
					style={{ transform: "rotate(45deg)" }}
				/>
			</div>
		</>
	);
}
