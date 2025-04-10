// app/dashboard/notifications/page.tsx
"use client";

import { useState } from "react";
import { notifications } from "@/mock/financeData";

// Define TypeScript interfaces for your data structures
interface Notification {
  id: string | number;
  type: "alert" | "info" | "warning" | string;
  date: string;
  title: string;
  message: string;
  read: boolean;
}

interface NotificationSettings {
  priceAlerts: boolean;
  dividends: boolean;
  portfolioAlerts: boolean;
  marketNews: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function NotificationsPage() {
  // Add proper typing to useState hooks
  const [notificationsList, setNotificationsList] =
    useState<Notification[]>(notifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    priceAlerts: true,
    dividends: true,
    portfolioAlerts: true,
    marketNews: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  // Add proper typing to function parameters
  const markAsRead = (id: string | number): void => {
    setNotificationsList((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = (): void => {
    setNotificationsList((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string | number): void => {
    setNotificationsList((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleSettingChange = (setting: keyof NotificationSettings): void => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTypeStyle = (type: string): string => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Notifications List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Notifications</h2>
            <div className="space-x-2">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="border-t">
            {notificationsList.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notificationsList.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeStyle(
                              notification.type
                            )}`}
                          >
                            {notification.type}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Notification Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Price Alerts</h3>
                <p className="text-sm text-gray-500">
                  Get notified of significant price changes
                </p>
              </div>
              <button
                onClick={() => handleSettingChange("priceAlerts")}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  settings.priceAlerts ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.priceAlerts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Dividends</h3>
                <p className="text-sm text-gray-500">
                  Get notified about dividend payments
                </p>
              </div>
              <button
                onClick={() => handleSettingChange("dividends")}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  settings.dividends ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.dividends ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Portfolio Alerts</h3>
                <p className="text-sm text-gray-500">
                  Get notified about portfolio changes
                </p>
              </div>
              <button
                onClick={() => handleSettingChange("portfolioAlerts")}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  settings.portfolioAlerts ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.portfolioAlerts ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Market News</h3>
                <p className="text-sm text-gray-500">
                  Get notified about important market news
                </p>
              </div>
              <button
                onClick={() => handleSettingChange("marketNews")}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  settings.marketNews ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.marketNews ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Delivery Settings</h3>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm">Email Notifications</p>
                </div>
                <button
                  onClick={() => handleSettingChange("emailNotifications")}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                    settings.emailNotifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      settings.emailNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Push Notifications</p>
                </div>
                <button
                  onClick={() => handleSettingChange("pushNotifications")}
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                    settings.pushNotifications ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                      settings.pushNotifications
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
