import { SidebarTrigger } from "@/components/ui/sidebar";
import { MainCarousel } from "@/components/mainCarousel/MainCarousel";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";

export function Engine() {
  const { user } = useAuth();

  return (
    <main className="flex">
      <div className="flex items-center justify-center">
        <SidebarTrigger />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1>
          <AppHeaderWithLogo />
        </h1>
        <p className="text-center mb-4">
          Welcome, {user?.displayName || "User"}! Swipe away.
        </p>
        <MainCarousel />
      </div>
    </main>
  );
}
