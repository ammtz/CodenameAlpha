"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceLineChartProps {
  timePeriod: string;
  compareWithSP500: boolean;
  compareWithInflation: boolean;
}

// Simulate market events and trends
const generateMarketEvent = (baseValue: number, eventType: string): number => {
  switch (eventType) {
    case "crash":
      return baseValue * (0.85 + Math.random() * 0.05); // -10% to -15%
    case "rally":
      return baseValue * (1.08 + Math.random() * 0.04); // +8% to +12%
    case "correction":
      return baseValue * (0.92 + Math.random() * 0.03); // -5% to -8%
    case "recovery":
      return baseValue * (1.04 + Math.random() * 0.03); // +4% to +7%
    default:
      return baseValue * (0.99 + Math.random() * 0.02); // -1% to +1%
  }
};

// Generate realistic market data
const generateHistoricalData = (period: string) => {
  const data = [];
  let months = 12;
  
  // Define period length
  switch (period) {
    case "YTD":
      months = new Date().getMonth() + 1;
      break;
    case "1Y":
      months = 12;
      break;
    case "5Y":
      months = 60;
      break;
    case "All":
      months = 120; // 10 years
      break;
  }

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Initialize values
  let portfolioValue = 100;
  let sp500Value = 100;
  let inflationValue = 100;

  // Define major events for different time periods
  const events: { [key: string]: string } = {
    "Mar 2020": "crash",    // COVID crash
    "Apr 2020": "rally",    // Recovery begins
    "Jan 2021": "rally",    // Bull market
    "Jan 2022": "correction", // Rate hikes begin
    "Oct 2022": "correction", // Bear market
    "Jan 2023": "recovery",   // Recovery
    "Jul 2023": "rally",     // AI boom
    "Oct 2023": "correction", // Rate concerns
    "Jan 2024": "rally",     // Fed pivot hopes
  };

  // Generate monthly data
  for (let i = 0; i <= months; i++) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + i);
    
    const dateKey = currentDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    // Check for major events
    const eventType = events[dateKey] || "normal";

    // Apply market events with different impacts for each asset class
    if (eventType !== "normal") {
      portfolioValue = generateMarketEvent(portfolioValue, eventType);
      sp500Value = generateMarketEvent(sp500Value, eventType);
      // Inflation is less volatile but follows trends
      inflationValue = generateMarketEvent(inflationValue, "normal");
    } else {
      // Normal market behavior
      // Portfolio (more stable due to diversification)
      portfolioValue *= (0.995 + Math.random() * 0.015);
      // S&P 500 (more volatile)
      sp500Value *= (0.99 + Math.random() * 0.02);
      // Inflation (slow steady growth)
      inflationValue *= (1.002 + Math.random() * 0.001);
    }

    // Add some noise to prevent perfectly smooth lines
    const noise = 0.002;
    portfolioValue *= (1 - noise + Math.random() * (noise * 2));
    sp500Value *= (1 - noise + Math.random() * (noise * 2));

    data.push({
      date: dateKey,
      portfolio: Math.round((portfolioValue - 100) * 100) / 100,
      sp500: Math.round((sp500Value - 100) * 100) / 100,
      inflation: Math.round((inflationValue - 100) * 100) / 100,
    });
  }

  return data;
};

export function PerformanceLineChart({
  timePeriod,
  compareWithSP500,
  compareWithInflation,
}: PerformanceLineChartProps) {
  const data = generateHistoricalData(timePeriod);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSP500" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => {
            if (window.innerWidth < 768) {
              const index = data.findIndex((item) => item.date === value);
              return index % 3 === 0 ? value : "";
            }
            return value;
          }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => `${value.toFixed(1)}%`}
          domain={['auto', 'auto']}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value) => [
            `${Number(value).toFixed(2)}%`,
            undefined,
          ]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="portfolio"
          name="Portfolio"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorPortfolio)"
        />
        {compareWithSP500 && (
          <Area
            type="monotone"
            dataKey="sp500"
            name="S&P 500"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorSP500)"
          />
        )}
        {compareWithInflation && (
          <Area
            type="monotone"
            dataKey="inflation"
            name="Inflation"
            stroke="#ffc658"
            fillOpacity={1}
            fill="url(#colorInflation)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
