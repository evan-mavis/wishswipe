import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatCardProps {
	title: string;
	description: string;
	value: ReactNode;
	icon: ReactNode;
	label?: string;
	label2?: string;
}

export function StatCard({
	title,
	description,
	value,
	icon,
	label,
	label2,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center">
					<div className="text-3xl font-bold text-fuchsia-300">{value}</div>
					{label && <p className="text-lg font-semibold">{label}</p>}
					{label2 && <p className="text-muted-foreground text-sm">{label2}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
