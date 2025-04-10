// mock/financeData.ts
export const portfolioData = {
  totalValue: 125750.32,
  dailyChange: 1250.75,
  dailyChangePercent: 1.05,
  holdings: [
    {
      id: "1",
      name: "AAPL",
      type: "stock",
      currentValue: 42500.5,
      quantity: 250,
      pricePerUnit: 170.002,
      dailyChange: 2.5,
      allocationPercentage: 33.8,
    },
    {
      id: "2",
      name: "VTSAX",
      type: "fund",
      currentValue: 35750.25,
      quantity: 425.5,
      pricePerUnit: 84.01,
      dailyChange: -0.3,
      allocationPercentage: 28.4,
    },
    {
      id: "3",
      name: "BTC",
      type: "crypto",
      currentValue: 22300.57,
      quantity: 0.425,
      pricePerUnit: 52471.92,
      dailyChange: 5.2,
      allocationPercentage: 17.7,
    },
    {
      id: "4",
      name: "Cash",
      type: "cash",
      currentValue: 25199.0,
      quantity: 25199,
      pricePerUnit: 1,
      dailyChange: 0,
      allocationPercentage: 20.1,
    },
  ],
};

export const transactionHistory = [
  {
    id: "t1",
    date: "2025-04-09",
    type: "buy",
    asset: "AAPL",
    quantity: 10,
    price: 169.5,
    total: 1695.0,
  },
  {
    id: "t2",
    date: "2025-04-08",
    type: "sell",
    asset: "BTC",
    quantity: 0.05,
    price: 51325.75,
    total: 2566.29,
  },
  {
    id: "t3",
    date: "2025-04-05",
    type: "buy",
    asset: "VTSAX",
    quantity: 25.5,
    price: 83.42,
    total: 2127.21,
  },
];

export const notifications = [
  {
    id: "n1",
    type: "alert",
    title: "Price Alert: BTC",
    message: "BTC has increased by 5% in the last 24 hours",
    date: "2025-04-10T08:30:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "info",
    title: "Dividend Payment",
    message: "Received $125.50 dividend payment from VTSAX",
    date: "2025-04-09T14:15:00Z",
    read: true,
  },
  {
    id: "n3",
    type: "warning",
    title: "Portfolio Rebalance Needed",
    message:
      "Your portfolio allocation has drifted more than 5% from your targets",
    date: "2025-04-08T09:45:00Z",
    read: false,
  },
];

export const tradingAlgos = [
  {
    id: "algo1",
    name: "DCA Bitcoin",
    description: "Dollar-cost average into Bitcoin weekly",
    status: "active",
    lastRun: "2025-04-08T00:00:00Z",
    performance: {
      totalInvested: 10000,
      currentValue: 12500,
      roi: 25,
    },
    parameters: {
      asset: "BTC",
      frequency: "weekly",
      amount: 250,
    },
  },
  {
    id: "algo2",
    name: "Index Fund Rebalancer",
    description: "Rebalances index fund allocation quarterly",
    status: "paused",
    lastRun: "2025-01-15T00:00:00Z",
    performance: {
      totalInvested: 50000,
      currentValue: 52750,
      roi: 5.5,
    },
    parameters: {
      assets: ["VTSAX", "VTIAX", "VBTLX"],
      frequency: "quarterly",
      allocation: [60, 30, 10],
    },
  },
];

// Portfolio historical performance for charts
export const portfolioHistory = [
  { date: "2025-01-01", value: 100000 },
  { date: "2025-01-15", value: 102500 },
  { date: "2025-02-01", value: 101800 },
  { date: "2025-02-15", value: 104200 },
  { date: "2025-03-01", value: 108500 },
  { date: "2025-03-15", value: 112000 },
  { date: "2025-04-01", value: 120000 },
  { date: "2025-04-10", value: 125750 },
];

// Asset allocation data
export const assetAllocation = [
  { category: "Stocks", value: 42500.5, percentage: 33.8 },
  { category: "Funds", value: 35750.25, percentage: 28.4 },
  { category: "Crypto", value: 22300.57, percentage: 17.7 },
  { category: "Cash", value: 25199.0, percentage: 20.1 },
];

// Target allocation for comparison
export const targetAllocation = [
  { category: "Stocks", percentage: 35 },
  { category: "Funds", percentage: 30 },
  { category: "Crypto", percentage: 15 },
  { category: "Cash", percentage: 20 },
];
