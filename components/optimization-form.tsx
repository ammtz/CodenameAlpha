"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";
import type { PortfolioAllocation, OptimizationParams } from "@/lib/types";
import { handlePortfolioAllocationChange } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [tickers, setTickers] = useState<string[]>(initialTickers);
  const [params, setParams] = useState<OptimizationParams>(initialParams);
  const [newTicker, setNewTicker] = useState("");
  const [newAllocation, setNewAllocation] = useState("");

  const [newStudyTicker, setNewStudyTicker] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  
  // Add refs for debouncing
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastChangeRef = useRef<{
    portfolio: PortfolioAllocation;
    ticker: string;
    value: number;
  } | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkAndRebalance = (updatedPortfolio: PortfolioAllocation, ticker: string, value: number) => {
    const totalAllocation = Object.values(updatedPortfolio).reduce(
      (sum, val) => sum + val,
      0
    );

    if (Math.abs(totalAllocation - 100) > 0.01) {
      const shouldRebalance = window.confirm(
        `Portfolio total is ${totalAllocation.toFixed(1)}%. Would you like to proportionally rebalance other allocations based on the new value for ${ticker}?`
      );

      if (shouldRebalance) {
        // Create a new portfolio object to store the rebalanced values
        const rebalancedPortfolio = { ...updatedPortfolio };
        
        // Lock in the changed ticker's value
        rebalancedPortfolio[ticker] = value;
        
        // Calculate remaining percentage to distribute
        const remaining = 100 - value;
        
        // Get other tickers and their current allocations
        const otherTickers = Object.entries(updatedPortfolio)
          .filter(([key]) => key !== ticker);
        
        const otherSum = otherTickers.reduce((sum, [_, val]) => sum + val, 0);

        if (otherSum === 0 || otherTickers.length === 0) {
          // If no other allocations or they sum to 0, distribute equally
          const equalShare = remaining / otherTickers.length;
          otherTickers.forEach(([t]) => {
            rebalancedPortfolio[t] = parseFloat(equalShare.toFixed(1));
          });
        } else {
          // Distribute proportionally based on original ratios
          otherTickers.forEach(([t, originalValue]) => {
            const proportion = originalValue / otherSum;
            rebalancedPortfolio[t] = parseFloat((remaining * proportion).toFixed(1));
          });
        }

        // Fix any rounding errors by adjusting the largest allocation
        const finalTotal = Object.values(rebalancedPortfolio).reduce((sum, val) => sum + val, 0);
        if (Math.abs(finalTotal - 100) > 0.01) {
          const diff = 100 - finalTotal;
          const largestOtherTicker = otherTickers
            .reduce((max, [currTicker, currValue]) => 
              currValue > (max ? updatedPortfolio[max] : 0) ? currTicker : max,
              ''
            );
            
          if (largestOtherTicker) {
            rebalancedPortfolio[largestOtherTicker] = parseFloat(
              (rebalancedPortfolio[largestOtherTicker] + diff).toFixed(1)
            );
          }
        }

        setPortfolio(rebalancedPortfolio);
      }
    }
  };

  const handlePortfolioChange = (ticker: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedPortfolio = {
      ...portfolio,
      [ticker]: numValue,
    };
    
    // Update the portfolio immediately
    setPortfolio(updatedPortfolio);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Store the latest change
    lastChangeRef.current = {
      portfolio: updatedPortfolio,
      ticker,
      value: numValue,
    };

    // Set new timeout for rebalancing check
    timeoutRef.current = setTimeout(() => {
      const lastChange = lastChangeRef.current;
      if (lastChange) {
        checkAndRebalance(lastChange.portfolio, lastChange.ticker, lastChange.value);
      }
    }, 5000); // 5 seconds delay
  };

  const handleAddTicker = () => {
    if (newTicker && newAllocation && !tickers.includes(newTicker)) {
      setTickers([...tickers, newTicker]);
      setPortfolio((prev) => ({
        ...prev,
        [newTicker]: parseFloat(newAllocation) || 0,
      }));
      setNewTicker("");
      setNewAllocation("");
    }
  };

  const handleRemoveTicker = (tickerToRemove: string) => {
    setTickers(tickers.filter((t) => t !== tickerToRemove));
    setPortfolio((prev) => {
      const { [tickerToRemove]: _, ...rest } = prev;
      return rest;
    });
  };

  const addStudyTicker = () => {
    if (
      newStudyTicker &&
      !tickers.includes(newStudyTicker.toUpperCase())
    ) {
      setTickers([...tickers, newStudyTicker.toUpperCase()]);
      setNewStudyTicker("");
    }
  };

  const removeStudyTicker = (ticker: string) => {
    setTickers(tickers.filter((t) => t !== ticker));
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

    onRunOptimization(portfolio, tickers, params);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Current Portfolio Allocation</div>
          <div className="text-sm text-muted-foreground">
            Total: {Object.values(portfolio).reduce((sum, val) => sum + val, 0).toFixed(1)}%
          </div>
        </div>
        {Object.entries(portfolio).map(([ticker, allocation]) => (
          <div key={ticker} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{ticker}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={allocation}
                  onChange={(e) => handlePortfolioChange(ticker, e.target.value)}
                  className="w-20"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Progress value={allocation} className="h-2" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="font-medium">Add New Ticker</div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label>Ticker</Label>
            <Input
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              placeholder="e.g. VTI"
            />
          </div>
          <div className="w-24">
            <Label>Allocation</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={newAllocation}
                onChange={(e) => setNewAllocation(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                placeholder="0.0"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <Button onClick={handleAddTicker} className="mb-0.5">Add</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="font-medium">Optimization Parameters</div>
        <div className="space-y-2">
          <Label>Target Alpha (%)</Label>
          <Input
            type="number"
            value={params.alphaTarget}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                alphaTarget: parseFloat(e.target.value) || 0,
              }))
            }
            min="0"
            max="20"
            step="0.1"
          />
        </div>
        <div className="space-y-2">
          <Label>Risk Level (1-10)</Label>
          <Input
            type="number"
            value={params.riskLevel}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                riskLevel: parseFloat(e.target.value) || 1,
              }))
            }
            min="1"
            max="10"
            step="0.1"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Running Optimization..." : "Run Optimization"}
      </Button>
    </form>
  );
}
