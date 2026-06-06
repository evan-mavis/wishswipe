import { redirect } from "next/navigation";
import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { LoginForm } from "@/components/loginForm/LoginForm";
import { PlaceholderListing } from "@/components/placeholderListing/PlaceholderListing";
import { getCurrentUser } from "@/server/auth";

export default async function LoginPage() {
  const missingAuthEnv = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ].filter((key) => !process.env[key]);
  const user = missingAuthEnv.length === 0 ? await getCurrentUser() : null;

  if (user) redirect("/swipe");

  return (
    <main className="relative grid min-h-svh grid-cols-1 overflow-hidden md:grid-cols-2">
      <div className="fixed top-6 left-6 z-10 hidden md:block">
        <AppHeaderWithLogo imageHeight="9" imageWidth="9" fontSize="text-3xl" margin="0" />
      </div>

      <div className="dark:bg-popover hidden flex-col items-center bg-zinc-100 p-6 md:flex">
        <div className="h-[60px]" />
        <div className="flex flex-1 items-center">
          <div className="flex w-[420px] flex-col items-center">
            <PlaceholderListing />
            <p className="text-muted-foreground mt-8 text-center text-lg">
              A playful way to discover eBay listings, dismiss the noise, and save
              the finds you actually want.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto mt-16 w-full max-w-xs">
          <LoginForm missingAuthEnv={missingAuthEnv} />
        </div>
      </div>
    </main>
  );
}
