// app/dashboard/what-if/page.tsx
"use client";

import { useState } from "react";
import { portfolioData } from "@/mock/financeData";

// Define interfaces for our data types
interface Holding {
  id: string;
  name: string;
  type: string;
  currentValue: number;
}

interface Portfolio {
  totalValue: number;
  holdings: Holding[];
}

interface ScenarioImpact {
  newTotal: number;
  difference: number;
  percentChange: string;
}

interface ScenarioAssetImpact {
  assetId: string;
  assetName: string;
  percent: number;
}

interface CustomScenario {
  name: string;
  impacts: ScenarioAssetImpact[];
}

interface Scenario {
  name: string;
  description: string;
  impact: ScenarioImpact;
  custom?: boolean;
  impacts?: ScenarioAssetImpact[];
}

interface Scenarios {
  marketCrash: Scenario;
  bullRun: Scenario;
  custom: Scenario & {
    custom: boolean;
    impacts: ScenarioAssetImpact[];
  };
}

export default function WhatIfPage() {
  // Initial state based on portfolio data
  const [scenarios, setScenarios] = useState<Scenarios>({
    marketCrash: {
      name: "Market Crash",
      description: "Simulate a 30% market drop",
      impact: calculateMarketCrash(30),
    },
    bullRun: {
      name: "Bull Run",
      description: "Simulate a 50% crypto bull run with 10% stock gain",
      impact: calculateBullRun(50, 10),
    },
    custom: {
      name: "Custom Scenario",
      description: "Build your own scenario",
      custom: true,
      impacts: portfolioData.holdings.map((h) => ({
        assetId: h.id,
        assetName: h.name,
        percent: 0,
      })),
      impact: {
        newTotal: portfolioData.totalValue,
        difference: 0,
        percentChange: "0.00",
      },
    },
  });

  const [customScenario, setCustomScenario] = useState<CustomScenario>({
    name: "Custom Scenario",
    impacts: portfolioData.holdings.map((h) => ({
      assetId: h.id,
      assetName: h.name,
      percent: 0,
    })),
  });

  // Helper functions to calculate scenarios
  function calculateMarketCrash(percentage: number): ScenarioImpact {
    const stocksAndFunds = portfolioData.holdings
      .filter((h) => h.type === "stock" || h.type === "fund")
      .reduce((sum, h) => sum + h.currentValue, 0);

    const crypto = portfolioData.holdings
      .filter((h) => h.type === "crypto")
      .reduce((sum, h) => sum + h.currentValue, 0);

    // Stocks and funds drop by percentage, crypto drops by 1.5x the percentage
    const loss =
      stocksAndFunds * (percentage / 100) + crypto * ((percentage * 1.5) / 100);

    return {
      newTotal: portfolioData.totalValue - loss,
      difference: -loss,
      percentChange: (-((loss / portfolioData.totalValue) * 100)).toFixed(2),
    };
  }

  function calculateBullRun(
    cryptoPercent: number,
    stockPercent: number
  ): ScenarioImpact {
    const stocks = portfolioData.holdings
      .filter((h) => h.type === "stock")
      .reduce((sum, h) => sum + h.currentValue, 0);

    const crypto = portfolioData.holdings
      .filter((h) => h.type === "crypto")
      .reduce((sum, h) => sum + h.currentValue, 0);

    const gain = stocks * (stockPercent / 100) + crypto * (cryptoPercent / 100);

    return {
      newTotal: portfolioData.totalValue + gain,
      difference: gain,
      percentChange: ((gain / portfolioData.totalValue) * 100).toFixed(2),
    };
  }

  function calculateCustomScenario(): ScenarioImpact {
    let newTotal = portfolioData.totalValue;

    customScenario.impacts.forEach((impact) => {
      const asset = portfolioData.holdings.find((h) => h.id === impact.assetId);
      if (asset) {
        const change = asset.currentValue * (impact.percent / 100);
        newTotal += change;
      }
    });

    const difference = newTotal - portfolioData.totalValue;

    return {
      newTotal,
      difference,
      percentChange: ((difference / portfolioData.totalValue) * 100).toFixed(2),
    };
  }

  function handleCustomChange(assetId: string, value: string): void {
    const newImpacts = customScenario.impacts.map((impact) =>
      impact.assetId === assetId
        ? { ...impact, percent: parseFloat(value) || 0 }
        : impact
    );

    setCustomScenario({
      ...customScenario,
      impacts: newImpacts,
    });

    // Update the scenarios state with new calculation
    setScenarios((prev) => {
      const calculated = calculateCustomScenario();
      return {
        ...prev,
        custom: {
          ...prev.custom,
          impact: calculated,
        },
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">What-If Scenario Generator</h2>
        <p className="text-gray-600 mb-4">
          Simulate different market scenarios to see their potential impact on
          your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Crash Scenario */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">
            {scenarios.marketCrash.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {scenarios.marketCrash.description}
          </p>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Portfolio Value:</span>
              <span className="font-medium">
                ${portfolioData.totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">New Portfolio Value:</span>
              <span className="font-medium">
                ${scenarios.marketCrash.impact.newTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Difference:</span>
              <span className="font-medium text-red-600">
                $
                {Math.abs(
                  scenarios.marketCrash.impact.difference
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage Change:</span>
              <span className="font-medium text-red-600">
                {scenarios.marketCrash.impact.percentChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Bull Run Scenario */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">
            {scenarios.bullRun.name}
          </h3>
          <p className="text-gray-600 mb-4">{scenarios.bullRun.description}</p>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Portfolio Value:</span>
              <span className="font-medium">
                ${portfolioData.totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">New Portfolio Value:</span>
              <span className="font-medium">
                ${scenarios.bullRun.impact.newTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Difference:</span>
              <span className="font-medium text-green-600">
                +${scenarios.bullRun.impact.difference.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage Change:</span>
              <span className="font-medium text-green-600">
                +{scenarios.bullRun.impact.percentChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Custom Scenario */}
        <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-2">{customScenario.name}</h3>
          <p className="text-gray-600 mb-4">
            Adjust asset performance to create a custom scenario
          </p>

          <div className="space-y-4 mb-4">
            {customScenario.impacts.map((impact) => (
              <div key={impact.assetId} className="flex items-center space-x-4">
                <label className="w-20 text-sm font-medium">
                  {impact.assetName}
                </label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={impact.percent}
                  onChange={(e) =>
                    handleCustomChange(impact.assetId, e.target.value)
                  }
                  className="flex-grow"
                />
                <span className="w-16 text-right">
                  {impact.percent > 0 && "+"}
                  {impact.percent}%
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Portfolio Value:</span>
              <span className="font-medium">
                ${portfolioData.totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">New Portfolio Value:</span>
              <span className="font-medium">
                ${scenarios.custom.impact.newTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Difference:</span>
              <span
                className={`font-medium ${
                  scenarios.custom.impact.difference >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {scenarios.custom.impact.difference >= 0 ? "+" : ""}$
                {Math.abs(scenarios.custom.impact.difference).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage Change:</span>
              <span
                className={`font-medium ${
                  parseFloat(scenarios.custom.impact.percentChange) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(scenarios.custom.impact.percentChange) >= 0
                  ? "+"
                  : ""}
                {scenarios.custom.impact.percentChange}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
