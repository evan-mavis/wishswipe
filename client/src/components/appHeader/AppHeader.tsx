export function AppHeader() {
  return (
    <>
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
      <p className="mx-2 mb-4 text-center">
        A swipe-based app for discovering and saving eBay items. Swipe right to
        wishlist, left to dismiss.
      </p>
    </>
  );
}
