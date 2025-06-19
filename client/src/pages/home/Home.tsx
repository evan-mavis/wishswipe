import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { LoginForm } from "@/components/loginForm/LoginForm";
import { DemoListing } from "@/components/demoListing/DemoListing";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="grid min-h-svh relative overflow-hidden grid-cols-1 md:grid-cols-2">
      <div className="fixed top-6 left-6 z-10 hidden md:block">
        <h1 className="m-0">
          <AppHeaderWithLogo
            imageHeight="9"
            imageWidth="9"
            fontSize="text-3xl"
            margin="0"
          />
        </h1>
      </div>

      <motion.div className="hidden md:flex flex-col items-center p-6 bg-popover">
        <div className="h-[60px]" /> {/* Spacer for header */}
        <div className="flex-1 flex items-center">
          <div className="flex flex-col items-center w-[400px]">
            <DemoListing />
            <p className="text-lg text-muted-foreground mt-8 text-center">
              A swipe-based app for discovering and saving eBay items. Swipe
              right to wishlist, left to dismiss.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xs mx-auto mt-16">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Home;
