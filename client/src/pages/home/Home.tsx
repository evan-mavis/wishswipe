import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { LoginForm } from "@/components/loginForm/LoginForm";

function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 ">
        <a href="#" className="flex items-center">
          <h1 className="m-0">
            <AppHeaderWithLogo
              imageHeight="9"
              imageWidth="9"
              fontSize="text-3xl"
              margin="0"
            />
          </h1>
        </a>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full ">
            <p className="text-lg text-center">
              A swipe-based app for discovering and saving eBay items. Swipe
              right to wishlist, left to dismiss.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-popover lg:flex">
        <div className="w-full max-w-xs mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Home;
