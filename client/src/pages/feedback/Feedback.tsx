import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Github,
	ExternalLink,
	AlertCircle,
	Bug,
	Star,
	MessageSquare,
} from "lucide-react";

export function Feedback() {
	return (
		<div className="container mx-auto mt-6 max-w-4xl p-6">
			<div className="mb-8">
				<h1 className="mb-2 flex items-center gap-2 text-3xl font-bold">
					<MessageSquare className="text-xl" /> Feedback & Issues
				</h1>
				<p className="text-muted-foreground">
					Help us improve WishSwipe by reporting issues and suggesting features.
				</p>
			</div>

			<Card className="mb-8 border-2 border-orange-200 dark:border-orange-800">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="text-xl text-orange-500" />
						Report Issues & Feature Requests
					</CardTitle>
					<CardDescription>
						Use our GitHub repository to report bugs, request features, or share
						your ideas.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="space-y-2 text-sm">
								<div className="flex items-center gap-2">
									<Bug className="h-4 w-4 text-red-500" />
									<span>Bug reports with steps to reproduce</span>
								</div>
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-green-500" />
									<span>Feature requests and improvements</span>
								</div>
							</div>
						</div>
						<Button
							asChild
							className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
						>
							<a
								href="https://github.com/evan-mavis/wishswipe/issues"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								<Github className="h-4 w-4" />
								Open GitHub Issue
								<ExternalLink className="h-4 w-4" />
							</a>
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-xl">Guidelines</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="mb-2 font-semibold">For Bug Reports:</h3>
						<ul className="text-muted-foreground ml-4 space-y-1 text-sm">
							<li>
								• Use the{" "}
								<span className="rounded bg-red-500 px-1 font-mono text-black">
									bug
								</span>{" "}
								label
							</li>
							<li>• Describe what you expected to happen</li>
							<li>• Describe what actually happened</li>
							<li>• Include steps to reproduce the issue</li>
							<li>• Add screenshots if applicable</li>
						</ul>
					</div>
					<div>
						<h3 className="mb-2 font-semibold">For Feature Requests:</h3>
						<ul className="text-muted-foreground ml-4 space-y-1 text-sm">
							<li>
								• Use the{" "}
								<span className="rounded bg-green-500 px-1 font-mono text-black">
									feature request
								</span>{" "}
								or{" "}
								<span className="rounded bg-yellow-200 px-1 font-mono text-black">
									enhancement
								</span>{" "}
								label
							</li>
							<li>• Explain why this would be useful</li>
							<li>• Consider if others would benefit from this</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
