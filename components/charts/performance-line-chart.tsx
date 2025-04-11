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

// Generate placeholder data based on time period
const generateData = (period: string) => {
  const data = [];
  let months = 12;

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
      months = 120;
      break;
  }

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  let portfolioValue = 100000;
  let sp500Value = 100000;
  let inflationValue = 100000;

  for (let i = 0; i <= months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Simulate some random growth with overall upward trend
    const portfolioGrowth = 1 + (Math.random() * 0.03 - 0.01);
    const sp500Growth = 1 + (Math.random() * 0.04 - 0.015);
    const inflationGrowth = 1 + Math.random() * 0.005;

    portfolioValue *= portfolioGrowth;
    sp500Value *= sp500Growth;
    inflationValue *= inflationGrowth;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      portfolio: Math.round(portfolioValue),
      sp500: Math.round(sp500Value),
      inflation: Math.round(inflationValue),
    });
  }

  return data;
};

export function PerformanceLineChart({
  timePeriod,
  compareWithSP500,
  compareWithInflation,
}: PerformanceLineChartProps) {
  const data = generateData(timePeriod);

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
            // Show fewer ticks on mobile
            if (window.innerWidth < 768) {
              // Only show every 3rd tick
              const index = data.findIndex((item) => item.date === value);
              return index % 3 === 0 ? value : "";
            }
            return value;
          }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value) => [
            `$${Number(value).toLocaleString()}`,
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
