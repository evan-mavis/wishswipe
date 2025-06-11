import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { AppCarousel } from "@/components/appCarousel/AppCarousel";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function Home() {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col justify-start items-center">
      <h1>
        <AppHeaderWithLogo />
      </h1>
      {user ? (
        <AppCarousel />
      ) : (
        <div className="mb-4">
          <p className="mx-2 mb-4 text-center">
            A swipe-based app for discovering and saving eBay items. Swipe right
            to wishlist, left to dismiss.
          </p>
          <Button onClick={signInWithGoogle}>Sign in to get started!</Button>
        </div>
      )}
    </div>
  );
}

export default Home;
