import { SidebarTrigger } from "@/components/ui/sidebar";
import { MainCarousel } from "@/components/mainCarousel/MainCarousel";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { ArrowDownToLine, Trash2 } from "lucide-react";

export function Engine() {
  const { user } = useAuth();

  return (
    <main className="flex">
      <div className="flex items-center justify-center">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>
          <AppHeaderWithLogo
            fontSize="text-4xl"
            imageHeight="12"
            imageWidth="12"
          />
        </h1>
        <p className="text-center mb-4">
          Welcome, {user?.displayName || "User"}! Swipe away.
        </p>
        <div className="w-[70%] flex flex-col items-center">
          <MainCarousel />
          <div className="flex justify-between w-full mt-2">
            <Trash2 size="40" />
            <ArrowDownToLine size="40" />
          </div>
        </div>
      </div>
    </main>
  );
}
