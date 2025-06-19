import { ChevronLeft, ChevronRight } from "lucide-react";

export function CornersFrame() {
  return (
    <>
      <div className="absolute -top-1.5 -left-1.5 sm:top-0 sm:left-0">
        <ChevronLeft
          className="text-fuchsia-300"
          style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute -top-1.5 -right-1.5 sm:top-0 sm:right-0">
        <ChevronRight
          className="text-fuchsia-300"
          style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute -bottom-1.5 -left-1.5 sm:bottom-0 sm:left-0">
        <ChevronLeft
          className="text-fuchsia-300"
          style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute -bottom-1.5 -right-1.5 sm:bottom-0 sm:right-0">
        <ChevronRight
          className="text-fuchsia-300"
          style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
        />
      </div>
    </>
  );
}
