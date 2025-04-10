// app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardPage() {
  const quickStats = [
    {
      name: "Portfolio Value",
      value: "$124,349.21",
      change: "+2.3%",
      positive: true,
    },
    {
      name: "Today's Change",
      value: "+$1,242.10",
      change: "+1.0%",
      positive: true,
    },
    {
      name: "Monthly Return",
      value: "+$3,521.62",
      change: "+2.9%",
      positive: true,
    },
    {
      name: "YTD Return",
      value: "+$14,721.98",
      change: "+13.4%",
      positive: true,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome to your financial blueprint dashboard.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {stat.name}
            </p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p
                className={`ml-2 text-sm font-medium ${
                  stat.positive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main chart */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-semibold">Portfolio Performance</h2>
              <div className="flex space-x-2">
                <button className="btn btn-secondary text-sm py-1">1D</button>
                <button className="btn btn-secondary text-sm py-1">1W</button>
                <button className="btn btn-primary text-sm py-1">1M</button>
                <button className="btn btn-secondary text-sm py-1">1Y</button>
                <button className="btn btn-secondary text-sm py-1">All</button>
              </div>
            </div>
            <div className="card-body">
              {/* Placeholder for chart */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization would appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Recent Notifications</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <span className="badge badge-info">Info</span>
                  <span className="ml-2 text-xs text-gray-500">
                    April 9, 2025
                  </span>
                </div>
                <p className="text-sm">Dividend payment received: $42.50</p>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <span className="badge badge-warning">Alert</span>
                  <span className="ml-2 text-xs text-gray-500">
                    April 8, 2025
                  </span>
                </div>
                <p className="text-sm">
                  AAPL reached your target price of $210
                </p>
              </div>
              <Link
                href="/dashboard/notifications"
                className="block p-4 text-center text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
              >
                View all notifications
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link
                  href="/dashboard/what-if"
                  className="btn btn-primary w-full block text-center"
                >
                  Run a What-If Scenario
                </Link>
                <button className="btn btn-secondary w-full">
                  Rebalance Portfolio
                </button>
                <button className="btn btn-secondary w-full">
                  Set a Price Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
