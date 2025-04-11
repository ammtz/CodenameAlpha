"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { OptimizationResult } from "@/lib/types";

interface OptimizationResultsProps {
  results: OptimizationResult;
  selectedScenario: number | null;
  onSelectScenario: (index: number) => void;
}

export default function OptimizationResults({
  results,
  selectedScenario,
  onSelectScenario,
}: OptimizationResultsProps) {
  const [activeTab, setActiveTab] = useState("chart");

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clickedPoint = data.activePayload[0].payload;
      const scenarioIndex = results.scenarios.findIndex(
        (scenario) =>
          scenario.risk === clickedPoint.risk &&
          scenario.alpha === clickedPoint.alpha
      );
      if (scenarioIndex !== -1) {
        onSelectScenario(scenarioIndex);
      }
    }
  };

  const selectedScenarioData =
    selectedScenario !== null ? results.scenarios[selectedScenario] : null;

  // Format data for the scatter plot
  const scatterData = results.scenarios.map((scenario) => ({
    risk: scenario.risk,
    alpha: scenario.alpha,
    z: 1, // Size factor
  }));

  // Add a highlighted point for the selected scenario
  const selectedPoint =
    selectedScenario !== null
      ? [
          {
            risk: results.scenarios[selectedScenario].risk,
            alpha: results.scenarios[selectedScenario].alpha,
            z: 2, // Larger size for selected point
          },
        ]
      : [];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Risk-Return Chart</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                onClick={handleChartClick}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="risk"
                  name="Risk"
                  domain={["dataMin - 1", "dataMax + 1"]}
                  label={{ value: "Risk", position: "bottom", offset: 0 }}
                />
                <YAxis
                  type="number"
                  dataKey="alpha"
                  name="Alpha"
                  domain={["dataMin - 1", "dataMax + 1"]}
                  label={{ value: "Alpha (%)", angle: -90, position: "left" }}
                />
                <ZAxis type="number" dataKey="z" range={[60, 120]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value, name) => [
                    name === "Alpha" ? `${value}%` : value,
                    name,
                  ]}
                />
                <Scatter name="Scenarios" data={scatterData} fill="#8884d8" />
                {selectedPoint.length > 0 && (
                  <Scatter
                    name="Selected"
                    data={selectedPoint}
                    fill="#ff7300"
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {selectedScenarioData && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Scenario</p>
                    <p className="text-lg font-medium">
                      {selectedScenario !== null ? selectedScenario + 1 : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alpha</p>
                    <p className="text-lg font-medium">
                      {selectedScenarioData.alpha}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk</p>
                    <p className="text-lg font-medium">
                      {selectedScenarioData.risk}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Sharpe Ratio
                    </p>
                    <p className="text-lg font-medium">
                      {(
                        selectedScenarioData.alpha / selectedScenarioData.risk
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="allocations">
          {selectedScenarioData ? (
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium mb-2">
                  Scenario{" "}
                  {selectedScenario !== null ? selectedScenario + 1 : ""}{" "}
                  Allocations
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedScenarioData.allocations).map(
                    ([ticker, allocation]) => (
                      <div
                        key={ticker}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="font-medium">{ticker}</span>
                        <span>{allocation}%</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: "Current", ...results.currentAllocation },
                      {
                        name: "Optimized",
                        ...selectedScenarioData.allocations,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Allocation (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    {Object.keys(selectedScenarioData.allocations).map(
                      (ticker, index) => (
                        <Line
                          key={ticker}
                          type="monotone"
                          dataKey={ticker}
                          stroke={`hsl(${index * 30}, 70%, 50%)`}
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      )
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-60">
              <p className="text-muted-foreground">
                Select a scenario to view allocations
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
