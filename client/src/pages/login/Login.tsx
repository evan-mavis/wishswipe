import { AppHeaderWithLogo } from "@/components/appHeader/AppHeaderWithLogo";
import { LoginForm } from "@/components/loginForm/LoginForm";
import { DemoListing } from "@/components/demoListing/DemoListing";
import { motion } from "framer-motion";

function Login() {
	return (
		<div className="relative grid min-h-svh grid-cols-1 overflow-hidden md:grid-cols-2">
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

			<motion.div className="dark:bg-popover hidden flex-col items-center bg-zinc-200 p-6 md:flex">
				<div className="h-[60px]" /> {/* Spacer for header */}
				<div className="flex flex-1 items-center">
					<div className="flex w-[400px] flex-col items-center">
						<DemoListing />
						<p className="text-muted-foreground mt-8 text-center text-lg">
							A swipe-based app for discovering and saving eBay items. Swipe
							right to wishlist, left to dismiss.
						</p>
					</div>
				</div>
			</motion.div>

			<div className="flex flex-1 items-center justify-center p-6">
				<div className="mx-auto mt-16 w-full max-w-xs">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}

export default Login;
