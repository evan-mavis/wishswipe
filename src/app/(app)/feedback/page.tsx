import {
  AlertCircle,
  Bug,
  ExternalLink,
  Github,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeedbackPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-fuchsia-300">
          <MessageSquare className="text-xl" /> Feedback
        </h1>
        <p className="text-muted-foreground">
          Keep the app personal, sharp, and useful by tracking issues in GitHub.
        </p>
      </div>

      <Card className="border-2 border-fuchsia-200/70 dark:border-fuchsia-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-xl text-orange-500" />
            Report Issues & Feature Requests
          </CardTitle>
          <CardDescription>
            Open a GitHub issue for bugs, ideas, screenshots, and feature notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-red-500" />
                <span>Bug reports with reproduction steps and screenshots.</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                <span>Feature requests and improvements.</span>
              </div>
            </div>
            <Button asChild className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 sm:w-auto">
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
    </div>
  );
}
