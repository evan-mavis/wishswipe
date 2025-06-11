import { ChevronLeft, ChevronRight } from "lucide-react";

export function CornersFrame() {
  return (
    <>
      <div className="absolute top-0 left-0 ">
        <ChevronLeft
          className="text-fuchsia-300"
          style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute top-0 right-0 ">
        <ChevronRight
          className="text-fuchsia-300"
          style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 ">
        <ChevronLeft
          className="text-fuchsia-300"
          style={{ transform: "rotate(-45deg)", fontSize: "0.8em" }}
        />
      </div>
      <div className="absolute bottom-0 right-0 ">
        <ChevronRight
          className="text-fuchsia-300"
          style={{ transform: "rotate(45deg)", fontSize: "0.8em" }}
        />
      </div>
    </>
  );
}
