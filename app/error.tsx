"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card max-w-md w-full p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We encountered an error while loading this page.
            {error.digest && (
              <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="space-y-4">
            <button onClick={reset} className="btn btn-primary w-full">
              Try again
            </button>
            <a
              href="/dashboard"
              className="btn btn-secondary w-full block text-center"
            >
              Return to dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
