import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function Home() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>
        <AppHeaderWithLogo />
      </h1>
      <>
        <p className="text-lg mb-4 text-center">
          A swipe-based app for discovering and saving eBay items. Swipe right
          to wishlist, left to dismiss.
        </p>
        <Button onClick={signInWithGoogle}>Sign in to get started!</Button>
      </>
    </div>
  );
}

export default Home;
