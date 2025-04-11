"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OptimizationForm from "@/components/optimization-form";
import OptimizationResults from "@/components/optimization-results";
import RiskAnalysisForm from "@/components/risk-analysis-form";
import RiskAnalysisResults from "@/components/risk-analysis-results";
import {
  mockOptimizationResults,
  mockRiskAnalysisResults,
} from "@/lib/mock-data";
import type {
  PortfolioAllocation,
  OptimizationParams,
  OptimizationResult,
  RiskAnalysisResult,
} from "@/lib/types";

export default function PortfolioOptimizer() {
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioAllocation>(
    {
      VTI: 40,
      VXUS: 20,
      BND: 30,
      VTIP: 10,
    }
  );

  const [tickersToStudy, setTickersToStudy] = useState<string[]>([
    "VTI",
    "VXUS",
    "BND",
    "VTIP",
    "VNQ",
    "GLD",
  ]);

  const [optimizationParams, setOptimizationParams] =
    useState<OptimizationParams>({
      alphaTarget: 8,
      riskLevel: 5,
    });

  const [optimizationResults, setOptimizationResults] =
    useState<OptimizationResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  const [riskAnalysisPortfolio, setRiskAnalysisPortfolio] =
    useState<PortfolioAllocation>({
      VTI: 45,
      VXUS: 25,
      BND: 20,
      VTIP: 10,
    });

  const [riskAnalysisResults, setRiskAnalysisResults] =
    useState<RiskAnalysisResult | null>(null);

  const handleRunOptimization = (
    portfolio: PortfolioAllocation,
    tickers: string[],
    params: OptimizationParams
  ) => {
    setCurrentPortfolio(portfolio);
    setTickersToStudy(tickers);
    setOptimizationParams(params);

    // In a real app, this would call your API
    // For now, we'll use mock data
    setTimeout(() => {
      setOptimizationResults(mockOptimizationResults);
      setSelectedScenario(2); // Select middle scenario by default
    }, 1000);
  };

  const handleRunRiskAnalysis = (portfolio: PortfolioAllocation) => {
    setRiskAnalysisPortfolio(portfolio);

    // In a real app, this would call your API
    // For now, we'll use mock data
    setTimeout(() => {
      setRiskAnalysisResults(mockRiskAnalysisResults);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="optimize" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="optimize">Portfolio Optimization</TabsTrigger>
          <TabsTrigger value="analyze">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="optimize" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Parameters</CardTitle>
                <CardDescription>
                  Enter your current portfolio and optimization targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OptimizationForm
                  initialPortfolio={currentPortfolio}
                  initialTickers={tickersToStudy}
                  initialParams={optimizationParams}
                  onRunOptimization={handleRunOptimization}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
                <CardDescription>
                  Click on the chart to see allocations for different
                  risk-return scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                {optimizationResults ? (
                  <OptimizationResults
                    results={optimizationResults}
                    selectedScenario={selectedScenario}
                    onSelectScenario={setSelectedScenario}
                  />
                ) : (
                  <div className="flex items-center justify-center h-80 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      Run optimization to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>
                  Enter a portfolio allocation to analyze risk and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiskAnalysisForm
                  initialPortfolio={riskAnalysisPortfolio}
                  onRunAnalysis={handleRunRiskAnalysis}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis Results</CardTitle>
                <CardDescription>
                  Performance metrics and risk indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                {riskAnalysisResults ? (
                  <RiskAnalysisResults results={riskAnalysisResults} />
                ) : (
                  <div className="flex items-center justify-center h-80 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      Run analysis to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
