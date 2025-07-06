import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PriceRange } from "@/components/priceRange/PriceRange";
import { CONDITIONS } from "@/constants/conditions";
import { CATEGORIES } from "@/constants/categories";
import {
	preferencesService,
	type Preferences,
} from "@/services/preferencesService";

export function Preferences() {
	const [preferences, setPreferences] = useState<Preferences>({
		defaultSearchTerm: "",
		defaultCondition: "none",
		defaultCategory: "none",
		defaultPriceRange: [10, 75],
	});
	const [originalPreferences, setOriginalPreferences] = useState<Preferences>({
		defaultSearchTerm: "",
		defaultCondition: "none",
		defaultCategory: "none",
		defaultPriceRange: [10, 75],
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadPreferences();
	}, []);

	const loadPreferences = async () => {
		try {
			const savedPreferences = await preferencesService.loadPreferences();
			setPreferences(savedPreferences);
			setOriginalPreferences(savedPreferences);
		} catch (error) {
			console.error("Error loading preferences:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await preferencesService.savePreferences(preferences);
			// Update original preferences after successful save
			setOriginalPreferences(preferences);
		} catch (error) {
			console.error("Error saving preferences:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await preferencesService.deletePreferences();
			// Set to default preferences after successful deletion
			const defaultPrefs: Preferences = {
				defaultSearchTerm: "",
				defaultCondition: "none",
				defaultCategory: "none",
				defaultPriceRange: [10, 75],
			};
			setPreferences(defaultPrefs);
			setOriginalPreferences(defaultPrefs);
		} catch (error) {
			console.error("Error resetting preferences:", error);
		}
	};

	const updatePreference = <K extends keyof Preferences>(
		key: K,
		value: Preferences[K]
	) => {
		setPreferences((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	// Check if preferences have changed from original
	const hasChanges =
		preferences.defaultSearchTerm !== originalPreferences.defaultSearchTerm ||
		preferences.defaultCondition !== originalPreferences.defaultCondition ||
		preferences.defaultCategory !== originalPreferences.defaultCategory ||
		preferences.defaultPriceRange[0] !==
			originalPreferences.defaultPriceRange[0] ||
		preferences.defaultPriceRange[1] !==
			originalPreferences.defaultPriceRange[1];

	// Check if user has saved preferences (record exists in database)
	const hasSavedPreferences =
		originalPreferences.defaultSearchTerm !== "" ||
		originalPreferences.defaultCondition !== "none" ||
		originalPreferences.defaultCategory !== "none" ||
		originalPreferences.defaultPriceRange[0] !== 10 ||
		originalPreferences.defaultPriceRange[1] !== 75;

	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="mb-8">
				<h1 className="text-foreground text-3xl font-bold">Preferences</h1>
				<p className="text-muted-foreground mt-2">
					Set your default search and filter preferences for a better swiping
					experience.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<Card>
					<CardContent>
						<div className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="defaultSearch">Default Search Term</Label>
								<Input
									id="defaultSearch"
									name="defaultSearchTerm"
									placeholder="e.g., iPhone, vintage camera, guitar"
									value={preferences.defaultSearchTerm}
									onChange={(e) =>
										updatePreference("defaultSearchTerm", e.target.value)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="defaultCondition">Default Condition</Label>
								<Select
									value={preferences.defaultCondition}
									onValueChange={(value) =>
										updatePreference("defaultCondition", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="No Selection" />
									</SelectTrigger>
									<SelectContent>
										{CONDITIONS.map((condition) => (
											<SelectItem key={condition.value} value={condition.value}>
												{condition.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="defaultCategory">Default Category</Label>
								<Select
									value={preferences.defaultCategory}
									onValueChange={(value) =>
										updatePreference("defaultCategory", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="No Selection" />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIES.map((category) => (
											<SelectItem key={category.value} value={category.value}>
												{category.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="defaultPriceRange">Default Price Range</Label>
								<PriceRange
									value={preferences.defaultPriceRange}
									onChange={(value) =>
										updatePreference("defaultPriceRange", value)
									}
									label=""
									variant="preferences"
									className="max-w-md"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				<Separator />

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						disabled={!hasSavedPreferences}
						className="flex items-center gap-2"
					>
						<RotateCcw size={16} />
						Reset to Defaults
					</Button>
					<Button
						type="submit"
						disabled={isLoading || !hasChanges}
						className="flex items-center gap-2"
					>
						<Save size={16} />
						{isLoading ? "Saving..." : "Save Preferences"}
					</Button>
				</div>
			</form>
		</div>
	);
}
