"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import type { PortfolioAllocation, OptimizationParams } from "@/lib/types";
import { handlePortfolioAllocationChange } from "@/lib/utils";

interface OptimizationFormProps {
  initialPortfolio: PortfolioAllocation;
  initialTickers: string[];
  initialParams: OptimizationParams;
  onRunOptimization: (
    portfolio: PortfolioAllocation,
    tickers: string[],
    params: OptimizationParams
  ) => void;
}

export default function OptimizationForm({
  initialPortfolio,
  initialTickers,
  initialParams,
  onRunOptimization,
}: OptimizationFormProps) {
  const [portfolio, setPortfolio] =
    useState<PortfolioAllocation>(initialPortfolio);
  const [newTicker, setNewTicker] = useState("");
  const [newAllocation, setNewAllocation] = useState("");

  const [tickersToStudy, setTickersToStudy] =
    useState<string[]>(initialTickers);
  const [newStudyTicker, setNewStudyTicker] = useState("");

  const [alphaTarget, setAlphaTarget] = useState(initialParams.alphaTarget);
  const [riskLevel, setRiskLevel] = useState(initialParams.riskLevel);

  const [isLoading, setIsLoading] = useState(false);

  const addTicker = () => {
    if (newTicker && newAllocation) {
      // Calculate how much to reduce other allocations
      const newAllocationValue = Math.round(Number(newAllocation) * 10) / 10;
      const currentTotal = Object.values(portfolio).reduce(
        (sum, val) => sum + val,
        0
      );
      const remainingAllocation = 100 - currentTotal;

      if (newAllocationValue > remainingAllocation) {
        // Need to reduce other allocations
        const updatedPortfolio = handlePortfolioAllocationChange(
          { ...portfolio, [newTicker.toUpperCase()]: 0 },
          newTicker.toUpperCase(),
          newAllocationValue
        );
        setPortfolio(updatedPortfolio);
      } else {
        // Can simply add without adjusting others
        setPortfolio({
          ...portfolio,
          [newTicker.toUpperCase()]: newAllocationValue,
        });
      }

      // Final check to ensure total is exactly 100%
      const finalTotal = Object.values(portfolio).reduce(
        (sum, val) => sum + val,
        0
      );
      if (Math.abs(finalTotal - 100) < 0.1 && finalTotal !== 100) {
        const keys = Object.keys(portfolio);
        for (const key of keys) {
          if (portfolio[key] > 0) {
            portfolio[key] =
              Math.round((portfolio[key] + (100 - finalTotal)) * 10) / 10;
            break;
          }
        }
      }

      setNewTicker("");
      setNewAllocation("");
    }
  };

  const removeTicker = (ticker: string) => {
    const tickerValue = portfolio[ticker];
    const updatedPortfolio = { ...portfolio };
    delete updatedPortfolio[ticker];

    // Redistribute the removed ticker's allocation proportionally
    if (Object.keys(updatedPortfolio).length > 0) {
      const remainingTotal = Object.values(updatedPortfolio).reduce(
        (sum, val) => sum + val,
        0
      );

      if (remainingTotal === 0) {
        // If all remaining allocations are 0, distribute equally
        const equalShare =
          Math.round((100 / Object.keys(updatedPortfolio).length) * 10) / 10;
        Object.keys(updatedPortfolio).forEach((t) => {
          updatedPortfolio[t] = equalShare;
        });

        // Adjust to ensure total is exactly 100
        const adjustedTotal = Object.values(updatedPortfolio).reduce(
          (sum, val) => sum + val,
          0
        );
        if (adjustedTotal !== 100) {
          const firstTicker = Object.keys(updatedPortfolio)[0];
          updatedPortfolio[firstTicker] += 100 - adjustedTotal;
        }
      } else {
        // Distribute proportionally
        Object.keys(updatedPortfolio).forEach((t) => {
          const proportion = updatedPortfolio[t] / remainingTotal;
          updatedPortfolio[t] =
            Math.round((updatedPortfolio[t] + tickerValue * proportion) * 10) /
            10;
        });

        // Ensure total is exactly 100
        const newTotal = Object.values(updatedPortfolio).reduce(
          (sum, val) => sum + val,
          0
        );
        if (newTotal !== 100) {
          const largestTicker = Object.keys(updatedPortfolio).reduce(
            (max, curr) =>
              updatedPortfolio[curr] > updatedPortfolio[max] ? curr : max,
            Object.keys(updatedPortfolio)[0]
          );
          updatedPortfolio[largestTicker] += 100 - newTotal;
        }
      }
    }

    // Final check to ensure total is exactly 100%
    const finalTotal = Object.values(updatedPortfolio).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(finalTotal - 100) < 0.1 && finalTotal !== 100) {
      const keys = Object.keys(updatedPortfolio);
      if (keys.length > 0) {
        updatedPortfolio[keys[0]] =
          Math.round((updatedPortfolio[keys[0]] + (100 - finalTotal)) * 10) /
          10;
      }
    }

    setPortfolio(updatedPortfolio);
  };

  const addStudyTicker = () => {
    if (
      newStudyTicker &&
      !tickersToStudy.includes(newStudyTicker.toUpperCase())
    ) {
      setTickersToStudy([...tickersToStudy, newStudyTicker.toUpperCase()]);
      setNewStudyTicker("");
    }
  };

  const removeStudyTicker = (ticker: string) => {
    setTickersToStudy(tickersToStudy.filter((t) => t !== ticker));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate total allocation to check if it's 100%
    const totalAllocation = Object.values(portfolio).reduce(
      (sum, value) => sum + value,
      0
    );
    if (Math.abs(totalAllocation - 100) > 0.01) {
      alert("Portfolio allocations must sum to 100%");
      setIsLoading(false);
      return;
    }

    onRunOptimization(portfolio, tickersToStudy, { alphaTarget, riskLevel });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Current Portfolio</h3>
          <div className="space-y-2">
            {Object.entries(portfolio).map(([ticker, allocation]) => (
              <div key={ticker} className="flex items-center gap-2">
                <div className="w-24 bg-muted p-2 rounded text-center font-medium">
                  {ticker}
                </div>
                <Slider
                  value={[allocation]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => {
                    const updatedPortfolio = handlePortfolioAllocationChange(
                      portfolio,
                      ticker,
                      value[0]
                    );
                    setPortfolio(updatedPortfolio);
                  }}
                />
                <span className="text-sm w-12 text-right">{allocation}%</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTicker(ticker)}
                  className="ml-auto h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-2 mt-2">
            <div className="space-y-1 flex-1">
              <Label htmlFor="newTicker">Ticker</Label>
              <Input
                id="newTicker"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="e.g. VTI"
              />
            </div>
            <div className="space-y-1 w-24">
              <Label htmlFor="newAllocation">Allocation</Label>
              <Input
                id="newAllocation"
                type="number"
                value={newAllocation}
                onChange={(e) => setNewAllocation(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 20"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTicker}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Total:{" "}
            {Object.values(portfolio)
              .reduce((sum, value) => sum + value, 0)
              .toFixed(1)}
            % (should equal 100%)
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Tickers to Study</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {tickersToStudy.map((ticker) => (
              <div
                key={ticker}
                className="flex items-center bg-muted rounded-full px-3 py-1"
              >
                <span className="text-sm font-medium">{ticker}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStudyTicker(ticker)}
                  className="h-5 w-5 ml-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newStudyTicker}
              onChange={(e) => setNewStudyTicker(e.target.value)}
              placeholder="Add ticker to study"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={addStudyTicker}>
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="alphaTarget">Alpha Target (%)</Label>
              <span className="text-sm font-medium">{alphaTarget}%</span>
            </div>
            <Slider
              id="alphaTarget"
              min={0}
              max={20}
              step={0.5}
              value={[alphaTarget]}
              onValueChange={(value) => setAlphaTarget(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="riskLevel">Risk Tolerance (1-10)</Label>
              <span className="text-sm font-medium">{riskLevel}</span>
            </div>
            <Slider
              id="riskLevel"
              min={1}
              max={10}
              step={1}
              value={[riskLevel]}
              onValueChange={(value) => setRiskLevel(value[0])}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Running Optimization..." : "Run Optimization"}
      </Button>
    </form>
  );
}
