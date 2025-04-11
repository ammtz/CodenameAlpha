"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart4,
  Calendar,
  ChevronDown,
  DollarSign,
  Menu,
  Percent,
  PieChart,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AllocationPieChart } from "@/components/charts/allocation-pie-chart";
import { PerformanceLineChart } from "@/components/charts/performance-line-chart";
import { useMobile } from "@/hooks/use-mobile";

// Add a new import for the portfolio optimizer components
import PortfolioOptimizer from "@/components/portfolio-optimizer";

// Placeholder data
const portfolioData = {
  totalValue: 125750.42,
  totalInvested: 100000,
  netGainLoss: 25750.42,
  annualizedReturn: 8.45,
  timePeriod: "1Y",
};

const etfData = [
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    allocation: 40,
    value: 50300.17,
    performance: 12.5,
    rationale: "Broad US market exposure with low expense ratio",
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    allocation: 20,
    value: 25150.08,
    performance: 5.2,
    rationale: "International diversification to reduce country-specific risk",
  },
  {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    allocation: 30,
    value: 37725.13,
    performance: -1.8,
    rationale: "Fixed income exposure to reduce portfolio volatility",
  },
  {
    ticker: "VTIP",
    name: "Vanguard Short-Term Inflation-Protected Securities ETF",
    allocation: 10,
    value: 12575.04,
    performance: 2.1,
    rationale: "Inflation protection for preserving purchasing power",
  },
];

export default function Dashboard() {
  const isMobile = useMobile();
  const [timePeriod, setTimePeriod] = useState("1Y");
  const [compareWithSP500, setCompareWithSP500] = useState(false);
  const [compareWithInflation, setCompareWithInflation] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [allocations, setAllocations] = useState(
    etfData.map((etf) => etf.allocation)
  );
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Calculate total allocation to ensure it equals 100%
  const totalAllocation = allocations.reduce(
    (sum, allocation) => sum + allocation,
    0
  );
  const isValidAllocation = totalAllocation === 100;

  // Apply scenario effects
  const applyScenario = (scenario: string) => {
    if (activeScenario === scenario) {
      setActiveScenario(null);
      // Reset to original allocations
      setAllocations(etfData.map((etf) => etf.allocation));
    } else {
      setActiveScenario(scenario);

      // Apply different allocation strategies based on scenario
      if (scenario === "market-crash") {
        setAllocations([30, 15, 45, 10]); // More bonds during market crash
      } else if (scenario === "inflation-spike") {
        setAllocations([35, 15, 20, 30]); // More TIPS during inflation
      } else if (scenario === "bond-rally") {
        setAllocations([25, 15, 50, 10]); // More bonds during bond rally
      }
    }
  };

  // Calculate scenario impact
  const calculateScenarioImpact = () => {
    if (!activeScenario) return { value: portfolioData.totalValue, change: 0 };

    let multiplier = 1;

    switch (activeScenario) {
      case "market-crash":
        multiplier = 0.92; // -8% overall impact
        break;
      case "inflation-spike":
        multiplier = 0.97; // -3% overall impact
        break;
      case "bond-rally":
        multiplier = 1.04; // +4% overall impact
        break;
    }

    const newValue = portfolioData.totalValue * multiplier;
    const change = newValue - portfolioData.totalValue;

    return { value: newValue, change };
  };

  const scenarioImpact = calculateScenarioImpact();

  // Function to handle slider changes with proportional adjustments
  const handleAllocationChange = (index: number, newValue: number) => {
    // Round to 1 decimal place
    newValue = Math.round(newValue * 10) / 10;

    const oldValue = allocations[index];
    const difference = newValue - oldValue;

    if (difference === 0) return;

    const newAllocations = [...allocations];
    newAllocations[index] = newValue;

    // Get indices of other allocations
    const otherIndices = allocations
      .map((_, i) => i)
      .filter((i) => i !== index);

    if (otherIndices.length === 0) return;

    // Calculate sum of other allocations
    const otherSum = otherIndices.reduce((sum, i) => sum + allocations[i], 0);

    if (otherSum <= 0) {
      // If other allocations sum to 0, distribute equally
      const remainingValue = 100 - newValue;
      const equalShare =
        Math.round((remainingValue / otherIndices.length) * 10) / 10;

      otherIndices.forEach((i) => {
        newAllocations[i] = equalShare;
      });

      // Adjust to ensure total is exactly 100
      const adjustedTotal = newAllocations.reduce((sum, val) => sum + val, 0);
      if (adjustedTotal !== 100) {
        // Add or subtract the difference from the first non-zero allocation
        const diff = 100 - adjustedTotal;
        for (const i of otherIndices) {
          if (newAllocations[i] > 0 || diff > 0) {
            newAllocations[i] =
              Math.round((newAllocations[i] + diff) * 10) / 10;
            break;
          }
        }
      }
    } else {
      // Distribute proportionally
      otherIndices.forEach((i) => {
        const proportion = allocations[i] / otherSum;
        // Calculate adjustment and round to 1 decimal
        const adjustment = Math.round(-difference * proportion * 10) / 10;

        // Ensure no negative values
        newAllocations[i] = Math.max(
          0,
          Math.round((allocations[i] + adjustment) * 10) / 10
        );
      });

      // Check if total is exactly 100
      const total = newAllocations.reduce((sum, val) => sum + val, 0);

      // Check if total is exactly 100 (accounting for floating point precision)
      const roundedTotal = Math.round(total * 10) / 10;

      if (Math.abs(roundedTotal - 100) >= 0.1) {
        // Find a non-selected allocation to adjust
        const diff = 100 - roundedTotal;

        // Find the largest allocation among other indices to adjust
        const largestIndex = otherIndices.reduce(
          (maxIdx, currIdx) =>
            newAllocations[currIdx] > newAllocations[maxIdx] ? currIdx : maxIdx,
          otherIndices[0]
        );

        // Adjust the largest allocation to make total exactly 100
        newAllocations[largestIndex] =
          Math.round((newAllocations[largestIndex] + diff) * 10) / 10;

        // Ensure no negative values after adjustment
        if (newAllocations[largestIndex] < 0) {
          newAllocations[largestIndex] = 0;

          // If we still can't make it 100, adjust the selected slider
          const finalTotal = newAllocations.reduce((sum, val) => sum + val, 0);
          if (Math.abs(finalTotal - 100) >= 0.1) {
            newAllocations[index] =
              Math.round((newAllocations[index] + (100 - finalTotal)) * 10) /
              10;
          }
        }
      }
    }

    // After all calculations, do a final check and force to exactly 100
    const finalSum = newAllocations.reduce((sum, val) => sum + val, 0);
    if (Math.abs(finalSum - 100) < 0.1 && finalSum !== 100) {
      // Find any non-zero allocation to adjust
      for (let i = 0; i < newAllocations.length; i++) {
        if (newAllocations[i] > 0) {
          newAllocations[i] =
            Math.round((newAllocations[i] + (100 - finalSum)) * 10) / 10;
          break;
        }
      }
    }

    setAllocations(newAllocations);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <PieChart className="h-5 w-5" />
            <span className="hidden md:inline-block">
              Weatherproof Portfolio Dashboard
            </span>
            <span className="md:hidden">Portfolio</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{timePeriod}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTimePeriod("YTD")}>
                  YTD
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimePeriod("1Y")}>
                  1Y
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimePeriod("5Y")}>
                  5Y
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimePeriod("All")}>
                  All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={showScenarioModal} onOpenChange={setShowScenarioModal}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">
                    Simulate Scenario
                  </span>
                  <span className="sm:hidden">Simulate</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="w-full h-[95vh] overflow-y-auto"
              >
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div>
                    <h3 className="text-lg font-medium">What-If Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust allocations or select a scenario to see how your
                      portfolio might perform.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">ETF Allocations</h4>
                    {etfData.map((etf, index) => (
                      <div key={etf.ticker} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            {etf.ticker} ({etf.name.split(" ")[0]})
                          </label>
                          <span
                            className={`text-sm font-medium ${
                              !isValidAllocation ? "text-destructive" : ""
                            }`}
                          >
                            {allocations[index]}%
                          </span>
                        </div>
                        <Slider
                          value={[allocations[index]]}
                          min={0}
                          max={100}
                          step={0.1}
                          onValueChange={(value) =>
                            handleAllocationChange(index, value[0])
                          }
                        />
                      </div>
                    ))}

                    {!isValidAllocation && (
                      <p className="text-sm font-medium text-destructive">
                        Total allocation: {totalAllocation}% (must equal 100%)
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Scenario Analysis</h4>
                    <div className="grid gap-2">
                      <Button
                        variant={
                          activeScenario === "market-crash"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => applyScenario("market-crash")}
                      >
                        Market Crash (-20%)
                      </Button>
                      <Button
                        variant={
                          activeScenario === "inflation-spike"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => applyScenario("inflation-spike")}
                      >
                        Inflation Spike (+5%)
                      </Button>
                      <Button
                        variant={
                          activeScenario === "bond-rally"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => applyScenario("bond-rally")}
                      >
                        Bond Rally (+10%)
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Scenario Impact</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">
                            Simulated Portfolio Value
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">
                            $
                            {activeScenario
                              ? scenarioImpact.value.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : portfolioData.totalValue.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                          </div>
                          {activeScenario && (
                            <div
                              className={`flex items-center text-sm ${
                                scenarioImpact.change >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {scenarioImpact.change >= 0 ? (
                                <ArrowUp className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDown className="mr-1 h-4 w-4" />
                              )}
                              $
                              {Math.abs(scenarioImpact.change).toLocaleString(
                                "en-US",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                              (
                              {(
                                (scenarioImpact.change /
                                  portfolioData.totalValue) *
                                100
                              ).toFixed(2)}
                              %)
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="hidden md:block">
                        <AllocationPieChart
                          data={etfData.map((etf, index) => ({
                            name: etf.ticker,
                            value: allocations[index],
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setShowScenarioModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 md:hidden"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full">
                  <nav className="grid gap-4 py-4">
                    <h4 className="text-sm font-medium">Navigation</h4>
                    <Button variant="ghost" className="justify-start">
                      Overview
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      Allocations
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      Performance
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      Analysis
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        {/* Portfolio Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {portfolioData.totalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                As of {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Invested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolioData.totalInvested.toLocaleString("en-US")}
              </div>
              <p className="text-xs text-muted-foreground">
                Initial investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Net Gain/Loss
              </CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-2xl font-bold text-green-500">
                <ArrowUp className="mr-1 h-5 w-5" />$
                {portfolioData.netGainLoss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                +
                {(
                  (portfolioData.netGainLoss / portfolioData.totalInvested) *
                  100
                ).toFixed(2)}
                % from initial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Annualized Return
              </CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-2xl font-bold text-green-500">
                <ArrowUp className="mr-1 h-5 w-5" />
                {portfolioData.annualizedReturn}%
              </div>
              <p className="text-xs text-muted-foreground">
                Over {timePeriod} period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Allocation and Performance Tabs */}
        <Tabs defaultValue="allocation" className="space-y-4">
          <TabsList>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Allocation Pie Chart */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>
                    Current ETF allocation by percentage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <AllocationPieChart
                      data={etfData.map((etf) => ({
                        name: etf.ticker,
                        value: etf.allocation,
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* ETF Breakdown Table */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>ETF Breakdown</CardTitle>
                  <CardDescription>
                    Details of each ETF in your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-80">
                    <TooltipProvider>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticker</TableHead>
                            <TableHead>Allocation</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Perf.</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {etfData.map((etf) => (
                            <TableRow key={etf.ticker}>
                              <TableCell>
                                <Tooltip>
                                  <TooltipTrigger className="font-medium underline decoration-dotted underline-offset-4">
                                    {etf.ticker}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-normal">{etf.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {etf.rationale}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell>{etf.allocation}%</TableCell>
                              <TableCell>
                                $
                                {etf.value.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </TableCell>
                              <TableCell
                                className={
                                  etf.performance >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                <div className="flex items-center">
                                  {etf.performance >= 0 ? (
                                    <ArrowUp className="mr-1 h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="mr-1 h-4 w-4" />
                                  )}
                                  {Math.abs(etf.performance)}%
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Portfolio Performance</CardTitle>
                    <CardDescription>
                      Historical performance over time
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sp500"
                        checked={compareWithSP500}
                        onCheckedChange={setCompareWithSP500}
                      />
                      <label htmlFor="sp500" className="text-sm font-medium">
                        S&P 500
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="inflation"
                        checked={compareWithInflation}
                        onCheckedChange={setCompareWithInflation}
                      />
                      <label
                        htmlFor="inflation"
                        className="text-sm font-medium"
                      >
                        Inflation
                      </label>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <PerformanceLineChart
                    timePeriod={timePeriod}
                    compareWithSP500={compareWithSP500}
                    compareWithInflation={compareWithInflation}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="optimize" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Optimization</CardTitle>
                <CardDescription>
                  Optimize your portfolio allocation and analyze risk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioOptimizer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
