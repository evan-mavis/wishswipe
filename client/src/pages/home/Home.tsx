import Auth from "@/components/auth/Auth";

function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="flex items-center">
        <img
          src="wishswipe-logo.png"
          alt="WishSwipe Logo"
          className="w-12 h-12"
        />
        Wish<em className="text-fuchsia-300">Swipe</em>
        <img
          src="wishswipe-logo.png"
          alt="WishSwipe Logo"
          className="w-12 h-12"
        />
      </h1>
      <Auth />
    </div>
  );
}

export default Home;
