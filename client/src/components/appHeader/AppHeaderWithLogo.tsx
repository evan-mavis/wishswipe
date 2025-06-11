import { AppHeader } from "./AppHeader";

export function AppHeaderWithLogo() {
  return (
    <div className="flex items-center">
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className="w-12 h-12"
      />
      <AppHeader />
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className="w-12 h-12"
      />
    </div>
  );
}
