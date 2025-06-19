import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Listings } from "@/components/listings/Listings";

export function SwipeView() {
  const { user } = useAuth();

  return (
    <SidebarInset>
      <main className="flex min-h-screen">
        <div className="flex items-center">
          <SidebarTrigger className="hidden md:block" />
        </div>
        <div className="flex flex-col items-center justify-center flex-1 py-4">
          <div className="md:hidden absolute top-4 left-4">
            <SidebarTrigger />
          </div>
          <h1 className="mb-2">
            <AppHeaderWithLogo
              fontSize="text-4xl"
              imageHeight="10"
              imageWidth="10"
              margin="2"
            />
          </h1>
          <p className="text-center mb-2">
            Welcome, {user?.displayName || "User"}! Swipe away.
          </p>
          <Listings />
        </div>
      </main>
    </SidebarInset>
  );
}
