import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	ThumbsUp,
	MessageSquare,
	Plus,
	Github,
	ExternalLink,
	AlertCircle,
	Star,
} from "lucide-react";

interface FeedbackItem {
	id: string;
	title: string;
	description: string;
	upvotes: number;
	status: "open" | "in-progress" | "completed";
	type: "feature" | "comment";
	createdAt: Date;
	userVoted: boolean;
}

export function Feedback() {
	const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
		{
			id: "1",
			title: "Dark mode for mobile app",
			description:
				"Add dark mode support for the mobile version of the app to improve user experience in low-light environments.",
			upvotes: 42,
			status: "open",
			type: "feature",
			createdAt: new Date("2024-01-15"),
			userVoted: false,
		},
		{
			id: "2",
			title: "Add wishlist sharing feature",
			description:
				"Allow users to share their wishlists with friends and family via link or social media.",
			upvotes: 67,
			status: "open",
			type: "feature",
			createdAt: new Date("2024-01-08"),
			userVoted: false,
		},
		{
			id: "3",
			title: "Great user experience",
			description:
				"The swipe interface is really intuitive and makes browsing items so much fun!",
			upvotes: 35,
			status: "completed",
			type: "comment",
			createdAt: new Date("2024-01-05"),
			userVoted: false,
		},
	]);

	const [newFeedback, setNewFeedback] = useState({
		title: "",
		description: "",
		type: "feature" as "feature" | "comment",
	});

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleUpvote = (id: string) => {
		setFeedbackItems((prev) =>
			prev.map((item) =>
				item.id === id
					? {
							...item,
							upvotes: item.userVoted ? item.upvotes - 1 : item.upvotes + 1,
							userVoted: !item.userVoted,
						}
					: item
			)
		);
	};

	const handleSubmitFeedback = () => {
		if (!newFeedback.title.trim() || !newFeedback.description.trim()) return;

		const newItem: FeedbackItem = {
			id: Date.now().toString(),
			title: newFeedback.title,
			description: newFeedback.description,
			upvotes: 0,
			status: "open",
			type: newFeedback.type,
			createdAt: new Date(),
			userVoted: false,
		};

		setFeedbackItems((prev) => [newItem, ...prev]);
		setNewFeedback({ title: "", description: "", type: "feature" });
		setIsDialogOpen(false);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "open":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "in-progress":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "feature":
				return <Star className="h-4 w-4" />;
			case "comment":
				return <MessageSquare className="h-4 w-4" />;
			default:
				return <MessageSquare className="h-4 w-4" />;
		}
	};

	const sortedFeedback = [...feedbackItems].sort(
		(a, b) => b.upvotes - a.upvotes
	);

	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="mb-8 flex items-start justify-between">
				<div>
					<h1 className="mb-2 text-3xl font-bold">Feedback & Issues</h1>
					<p className="text-muted-foreground">
						Help us improve WishSwipe by sharing your ideas and reporting
						issues.
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Add Feedback
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[500px]">
						<DialogHeader>
							<DialogTitle>Add New Feedback</DialogTitle>
							<DialogDescription>
								Share your ideas for new features, improvements, or non-critical
								issues.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<div className="md:col-span-2">
									<Input
										placeholder="Feedback title..."
										value={newFeedback.title}
										onChange={(e) =>
											setNewFeedback((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<select
										className="border-input bg-background w-full rounded-md border px-3 py-2"
										value={newFeedback.type}
										onChange={(e) =>
											setNewFeedback((prev) => ({
												...prev,
												type: e.target.value as "feature" | "comment",
											}))
										}
									>
										<option value="feature">Feature Request</option>
										<option value="comment">Comment</option>
									</select>
								</div>
							</div>
							<Textarea
								placeholder="Describe your feedback in detail..."
								rows={3}
								value={newFeedback.description}
								onChange={(e) =>
									setNewFeedback((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
							/>
							<div className="flex justify-end">
								<Button
									onClick={handleSubmitFeedback}
									disabled={
										!newFeedback.title.trim() || !newFeedback.description.trim()
									}
								>
									Submit Feedback
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* GitHub Issues Section */}
			<Card className="mb-8 border-2 border-orange-200 dark:border-orange-800">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-orange-500" />
						Critical Issues & Bug Reports
					</CardTitle>
					<CardDescription>
						For urgent bugs, security issues, or critical problems, please use
						our GitHub repository.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground mb-2 text-sm">
								GitHub issues get priority attention and are tracked more
								closely.
							</p>
							<p className="text-sm font-medium">
								Include: Steps to reproduce, expected vs actual behavior,
								screenshots if applicable
							</p>
						</div>
						<Button asChild className="bg-orange-600 hover:bg-orange-700">
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

			{/* Feedback List */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Community Feedback</h2>
				{sortedFeedback.map((item) => (
					<Card key={item.id} className="transition-shadow hover:shadow-md">
						<CardContent className="p-6">
							<div className="mb-3 flex items-start justify-between">
								<div className="mb-2 flex items-center gap-2">
									{getTypeIcon(item.type)}
									<h3 className="text-lg font-semibold">{item.title}</h3>
								</div>
								<div className="flex items-center gap-2">
									<Badge className={getStatusColor(item.status)}>
										{item.status.replace("-", " ")}
									</Badge>
									<Badge variant="outline">
										{new Date(item.createdAt).toLocaleDateString()}
									</Badge>
								</div>
							</div>
							<p className="text-muted-foreground mb-4">{item.description}</p>
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleUpvote(item.id)}
									className={`flex items-center gap-2 ${
										item.userVoted
											? "bg-blue-50 text-blue-600 dark:bg-blue-950"
											: ""
									}`}
								>
									<ThumbsUp
										className={`h-4 w-4 ${item.userVoted ? "fill-current" : ""}`}
									/>
									{item.upvotes} {item.upvotes === 1 ? "vote" : "votes"}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty State */}
			{sortedFeedback.length === 0 && (
				<Card>
					<CardContent className="p-8 text-center">
						<MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
						<h3 className="mb-2 text-lg font-semibold">No feedback yet</h3>
						<p className="text-muted-foreground">
							Be the first to share your ideas and help improve WishSwipe!
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
