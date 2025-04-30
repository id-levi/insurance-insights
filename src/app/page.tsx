"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { compareProviders } from "@/ai/flows/compare-providers";

const InsuranceProviders = [
  { label: "AXA", value: "AXA" },
  { label: "Allianz", value: "Allianz" },
  { label: "Cigna", value: "Cigna" },
  { label: "UnitedHealthcare", value: "UnitedHealthcare" },
];

const ComparisonAspects = [
  { label: "Coverage Limits", value: "coverage_limits" },
  { label: "Hospitalization Coverage", value: "hospitalization" },
  { label: "Deductible", value: "deductible" },
  { label: "Exclusions", value: "exclusions" },
];

export default function Home() {
  const [providerA, setProviderA] = useState<string | undefined>(undefined);
  const [providerB, setProviderB] = useState<string | undefined>(undefined);
  const [aspect, setAspect] = useState<string | undefined>(undefined);
  const [comparison, setComparison] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!providerA || !providerB || !aspect) {
      alert("Please select two providers and an aspect to compare.");
      return;
    }

    setLoading(true);
    try {
      const result = await compareProviders({
        providerA,
        providerB,
        aspect,
      });
      setComparison(result.comparison);
    } catch (error: any) {
      console.error("Comparison error:", error);
      setComparison(`Error generating comparison: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-secondary">
      <h1 className="text-3xl font-bold mb-6 text-primary">Insurance Insights</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Select onValueChange={setProviderA}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Provider A" />
          </SelectTrigger>
          <SelectContent>
            {InsuranceProviders.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setProviderB}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Provider B" />
          </SelectTrigger>
          <SelectContent>
            {InsuranceProviders.map((provider) => (
              <SelectItem key={provider.value} value={provider.value}>
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setAspect}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Comparison Aspect" />
          </SelectTrigger>
          <SelectContent>
            {ComparisonAspects.map((aspect) => (
              <SelectItem key={aspect.value} value={aspect.value}>
                {aspect.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleCompare}
        disabled={loading}
        className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
      >
        {loading ? "Comparing..." : "Compare"}
      </Button>

      {comparison && (
        <Card className="mt-8 w-full max-w-md rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Comparison Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{comparison}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
