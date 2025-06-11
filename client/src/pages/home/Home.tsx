import { AppHeader } from "@/components/appHeader/AppHeader";
import Auth from "@/components/auth/Auth";
import { CustomCarousel } from "@/components/customCarousel/CustomCarousel";

function Home() {
  return (
    <div className="flex flex-col justify-start items-center">
      <AppHeader />
      <Auth />
      <CustomCarousel />
    </div>
  );
}

export default Home;
