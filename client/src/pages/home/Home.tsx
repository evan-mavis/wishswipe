import { AppHeader } from "@/components/appHeader/AppHeader";
import { AppCarousel } from "@/components/appCarousel/AppCarousel";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col justify-start items-center">
      <AppHeader />
      {user ? (
        <AppCarousel />
      ) : (
        <div className="mb-4">
          <Button onClick={signInWithGoogle}>Sign in to get started!</Button>
        </div>
      )}
    </div>
  );
}

export default Home;
