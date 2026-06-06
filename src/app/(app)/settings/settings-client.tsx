"use client";

import { useState } from "react";
import { RotateCcw, Save, Settings } from "lucide-react";
import { savePreferencesAction, resetPreferencesAction } from "@/app/actions/preferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceRange } from "@/components/priceRange/PriceRange";
import { CATEGORIES } from "@/constants/categories";
import { CONDITIONS } from "@/constants/conditions";
import type { Preferences } from "@/server/preferences";

export function SettingsClient({
  initialPreferences,
}: {
  initialPreferences: Preferences;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [originalPreferences, setOriginalPreferences] = useState(initialPreferences);
  const [isLoading, setIsLoading] = useState(false);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const hasChanges =
    preferences.defaultSearchTerm !== originalPreferences.defaultSearchTerm ||
    preferences.defaultCondition !== originalPreferences.defaultCondition ||
    preferences.defaultCategory !== originalPreferences.defaultCategory ||
    preferences.defaultPriceRange[0] !== originalPreferences.defaultPriceRange[0] ||
    preferences.defaultPriceRange[1] !== originalPreferences.defaultPriceRange[1];

  const hasSavedPreferences =
    originalPreferences.defaultSearchTerm !== "" ||
    originalPreferences.defaultCondition !== "none" ||
    originalPreferences.defaultCategory !== "none" ||
    originalPreferences.defaultPriceRange[0] !== 10 ||
    originalPreferences.defaultPriceRange[1] !== 75;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await savePreferencesAction(preferences);
      setOriginalPreferences(preferences);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    const nextPreferences: Preferences = {
      defaultSearchTerm: "",
      defaultCondition: "none",
      defaultCategory: "none",
      defaultPriceRange: [10, 75],
    };
    await resetPreferencesAction();
    setPreferences(nextPreferences);
    setOriginalPreferences(nextPreferences);
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-foreground flex items-center gap-2 text-3xl font-bold">
          <Settings /> Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Tune the search defaults that shape your swipe deck.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultSearch">Default search term</Label>
                <Input
                  id="defaultSearch"
                  name="defaultSearchTerm"
                  placeholder="e.g. vintage camera, guitar, headphones"
                  value={preferences.defaultSearchTerm}
                  onChange={(event) =>
                    updatePreference("defaultSearchTerm", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCondition">Default condition</Label>
                <Select
                  value={preferences.defaultCondition}
                  onValueChange={(value) =>
                    updatePreference("defaultCondition", value)
                  }
                >
                  <SelectTrigger id="defaultCondition">
                    <SelectValue placeholder="No Selection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Selection</SelectItem>
                    {CONDITIONS.filter((condition) => condition !== "No Selection").map(
                      (condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCategory">Default category</Label>
                <Select
                  value={preferences.defaultCategory}
                  onValueChange={(value) =>
                    updatePreference("defaultCategory", value)
                  }
                >
                  <SelectTrigger id="defaultCategory">
                    <SelectValue placeholder="No Selection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Selection</SelectItem>
                    {CATEGORIES.filter((category) => category !== "No Selection").map(
                      (category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPriceRange">Default price range</Label>
                <PriceRange
                  value={preferences.defaultPriceRange}
                  onChange={(value) => updatePreference("defaultPriceRange", value)}
                  label=""
                  variant="preferences"
                  className="max-w-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-col justify-end gap-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasSavedPreferences}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset defaults
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isLoading ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
