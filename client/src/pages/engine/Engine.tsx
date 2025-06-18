import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { SwipeEngine } from "@/components/swipeEngine/SwipeEngine";

export function Engine() {
  const { user } = useAuth();

  return (
    <SidebarInset>
      <main className="flex">
        <div className="flex items-center justify-center">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
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
          <SwipeEngine />
        </div>
      </main>
    </SidebarInset>
  );
}
