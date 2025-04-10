// app/dashboard/shipyard/page.tsx
"use client";

import { useState } from "react";
import { tradingAlgos } from "@/mock/financeData";

export default function ShipyardPage() {
  const [algos, setAlgos] = useState(tradingAlgos);
  const [showNewAlgoModal, setShowNewAlgoModal] = useState(false);
  const [newAlgo, setNewAlgo] = useState({
    name: "",
    description: "",
    parameters: {
      asset: "BTC",
      frequency: "weekly",
      amount: 100,
    },
  });

  const toggleAlgoStatus = (id: string) => {
    setAlgos((prev) =>
      prev.map((algo) =>
        algo.id === id
          ? { ...algo, status: algo.status === "active" ? "paused" : "active" }
          : algo
      )
    );
  };

  const handleNewAlgoSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newId = `algo${algos.length + 1}`;

    setAlgos((prev) => [
      ...prev,
      {
        id: newId,
        name: newAlgo.name,
        description: newAlgo.description,
        status: "active",
        lastRun: new Date().toISOString(),
        performance: {
          totalInvested: 0,
          currentValue: 0,
          roi: 0,
        },
        parameters: newAlgo.parameters,
      },
    ]);

    setShowNewAlgoModal(false);
    setNewAlgo({
      name: "",
      description: "",
      parameters: {
        asset: "BTC",
        frequency: "weekly",
        amount: 100,
      },
    });
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Shipyard (Trading Algorithms)</h2>
          <button
            onClick={() => setShowNewAlgoModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Algo
          </button>
        </div>
        <p className="text-gray-600">
          Deploy and manage automated trading strategies for your portfolio.
        </p>
      </div>

      {/* Active Algorithms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {algos.map((algo) => (
          <div
            key={algo.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{algo.name}</h3>
                  <p className="text-gray-600 mt-1">{algo.description}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    algo.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {algo.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Invested
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    ${algo.performance.totalInvested}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Current Value
                  </dt>
                  <dd className="mt-1 text-lg font-semibold">
                    ${algo.performance.currentValue}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ROI</dt>
                  <dd
                    className={`mt-1 text-lg font-semibold ${
                      algo.performance.roi >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {algo.performance.roi >= 0 ? "+" : ""}
                    {algo.performance.roi}%
                  </dd>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last run: {formatDate(algo.lastRun)}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => toggleAlgoStatus(algo.id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    algo.status === "active"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {algo.status === "active" ? "Pause" : "Activate"}
                </button>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200">
                  Edit
                </button>
              </div>
            </div>

            {/* Algorithm Parameters */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Parameters
              </h4>
              <div className="bg-gray-50 rounded-md p-3">
                {algo.parameters.asset && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Asset:</span>
                    <span>{algo.parameters.asset}</span>
                  </div>
                )}
                {algo.parameters.frequency && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Frequency:</span>
                    <span className="capitalize">
                      {algo.parameters.frequency}
                    </span>
                  </div>
                )}
                {algo.parameters.amount && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Amount:</span>
                    <span>${algo.parameters.amount}</span>
                  </div>
                )}
                {algo.parameters.assets && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Assets:</span>
                    <span>{algo.parameters.assets.join(", ")}</span>
                  </div>
                )}
                {algo.parameters.allocation && (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Allocation:</span>
                    <span>{algo.parameters.allocation.join("% / ")}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Algorithm Modal */}
      {showNewAlgoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                Create New Trading Algorithm
              </h3>

              <form onSubmit={handleNewAlgoSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Algorithm Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newAlgo.name}
                    onChange={(e) =>
                      setNewAlgo({ ...newAlgo, name: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={newAlgo.description}
                    onChange={(e) =>
                      setNewAlgo({ ...newAlgo, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="asset"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Asset
                  </label>
                  <select
                    id="asset"
                    value={newAlgo.parameters.asset}
                    onChange={(e) =>
                      setNewAlgo({
                        ...newAlgo,
                        parameters: {
                          ...newAlgo.parameters,
                          asset: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="AAPL">Apple (AAPL)</option>
                    <option value="VTSAX">Vanguard Total Stock (VTSAX)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="frequency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    value={newAlgo.parameters.frequency}
                    onChange={(e) =>
                      setNewAlgo({
                        ...newAlgo,
                        parameters: {
                          ...newAlgo.parameters,
                          frequency: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={newAlgo.parameters.amount}
                    onChange={(e) =>
                      setNewAlgo({
                        ...newAlgo,
                        parameters: {
                          ...newAlgo.parameters,
                          amount: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full p-2 border rounded-md"
                    min="1"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAlgoModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Algorithm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
