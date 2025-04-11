"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RiskAnalysisResult } from "@/lib/types";

interface RiskAnalysisResultsProps {
  results: RiskAnalysisResult;
}

export default function RiskAnalysisResults({
  results,
}: RiskAnalysisResultsProps) {
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Format data for the drawdown chart
  const drawdownData = results.drawdowns.map((value, index) => ({
    name: `Scenario ${index + 1}`,
    value: Math.abs(value),
  }));

  // Format data for the stress test chart
  const stressTestData = Object.entries(results.stressTests).map(
    ([scenario, value]) => ({
      name: scenario,
      value: value,
    })
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Historical Performance
              </CardTitle>
              <CardDescription>Portfolio performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={results.historicalPerformance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Return"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Key Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(results.performanceMetrics).map(
                    ([metric, value]) => (
                      <div
                        key={metric}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{metric}</span>
                        <span className="font-medium">
                          {typeof value === "number" ? `${value}%` : value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(results.allocation).map(
                          ([ticker, value], index) => ({
                            name: ticker,
                            value: value,
                          })
                        )}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {Object.entries(results.allocation).map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Allocation"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(results.riskMetrics).map(
                    ([metric, value]) => (
                      <div
                        key={metric}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{metric}</span>
                        <span className="font-medium">
                          {typeof value === "number" ? value.toFixed(2) : value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Maximum Drawdowns</CardTitle>
                <CardDescription>
                  Potential losses in different scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={drawdownData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        label={{
                          value: "Loss (%)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Drawdown"]}
                      />
                      <Bar dataKey="value" fill="#ff8042">
                        {drawdownData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${index * 30}, 70%, 50%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Correlation Matrix</CardTitle>
              <CardDescription>
                Asset correlations in the portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                      {Object.keys(results.correlationMatrix).map((ticker) => (
                        <th
                          key={ticker}
                          className="px-4 py-2 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          {ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(results.correlationMatrix).map(
                      ([ticker, correlations]) => (
                        <tr key={ticker}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                            {ticker}
                          </td>
                          {Object.entries(correlations).map(
                            ([corTicker, value]) => (
                              <td
                                key={`${ticker}-${corTicker}`}
                                className="px-4 py-2 whitespace-nowrap text-sm"
                              >
                                {value.toFixed(2)}
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stress Test Results</CardTitle>
              <CardDescription>
                Portfolio performance under different market scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stressTestData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip formatter={(value) => [`${value}%`, "Impact"]} />
                    <Bar dataKey="value" fill="#8884d8">
                      {stressTestData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.value >= 0 ? "#00C49F" : "#FF8042"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tail Risk Analysis</CardTitle>
              <CardDescription>
                Value at Risk (VaR) and Expected Shortfall
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Value at Risk (VaR)</h4>
                  {Object.entries(results.valueAtRisk).map(
                    ([confidence, value]) => (
                      <div
                        key={confidence}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{confidence} Confidence</span>
                        <span className="font-medium text-red-500">
                          -{value}%
                        </span>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Expected Shortfall</h4>
                  {Object.entries(results.expectedShortfall).map(
                    ([confidence, value]) => (
                      <div
                        key={confidence}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{confidence} Confidence</span>
                        <span className="font-medium text-red-500">
                          -{value}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
