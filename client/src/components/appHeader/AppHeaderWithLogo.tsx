import { AppHeader } from "./AppHeader";

export function AppHeaderWithLogo() {
  return (
    <div className="flex items-center">
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className="w-25 h-25"
      />
      <AppHeader />
      <img
        src="wishswipe-logo.png"
        alt="WishSwipe Logo"
        className="w-25 h-25"
      />
    </div>
  );
}
