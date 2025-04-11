import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to handle portfolio allocation slider changes
export function handlePortfolioAllocationChange(
  allocations: Record<string, number>,
  ticker: string,
  newValue: number
): Record<string, number> {
  // Round to 1 decimal place
  newValue = Math.round(newValue * 10) / 10;

  const oldValue = allocations[ticker];
  const difference = newValue - oldValue;

  if (difference === 0) return allocations;

  const result = { ...allocations };
  result[ticker] = newValue;

  // Get other tickers
  const otherTickers = Object.keys(allocations).filter((t) => t !== ticker);

  if (otherTickers.length === 0) return result;

  // Calculate sum of other allocations
  const otherSum = otherTickers.reduce((sum, t) => sum + allocations[t], 0);

  if (otherSum <= 0) {
    // If other allocations sum to 0, distribute equally
    const remainingValue = 100 - newValue;
    const equalShare =
      Math.round((remainingValue / otherTickers.length) * 10) / 10;

    otherTickers.forEach((t) => {
      result[t] = equalShare;
    });

    // Adjust to ensure total is exactly 100
    const adjustedTotal = Object.values(result).reduce(
      (sum, val) => sum + val,
      0
    );
    if (adjustedTotal !== 100) {
      // Add or subtract the difference from the first non-zero allocation
      const diff = 100 - adjustedTotal;
      for (const t of otherTickers) {
        if (result[t] > 0 || diff > 0) {
          result[t] = Math.round((result[t] + diff) * 10) / 10;
          break;
        }
      }
    }
  } else {
    // Distribute proportionally
    otherTickers.forEach((t) => {
      const proportion = allocations[t] / otherSum;
      // Calculate adjustment and round to 1 decimal
      const adjustment = Math.round(-difference * proportion * 10) / 10;

      // Ensure no negative values
      result[t] = Math.max(
        0,
        Math.round((allocations[t] + adjustment) * 10) / 10
      );
    });

    // Check if total is exactly 100 (accounting for floating point precision)
    const total = Object.values(result).reduce((sum, val) => sum + val, 0);
    // Round to handle floating point precision issues
    const roundedTotal = Math.round(total * 10) / 10;

    if (Math.abs(roundedTotal - 100) >= 0.1) {
      // Find a non-selected allocation to adjust
      const diff = 100 - roundedTotal;

      // Find the largest allocation among other tickers to adjust
      const largestTicker = otherTickers.reduce(
        (maxTicker, currTicker) =>
          result[currTicker] > result[maxTicker] ? currTicker : maxTicker,
        otherTickers[0]
      );

      // Adjust the largest allocation to make total exactly 100
      result[largestTicker] =
        Math.round((result[largestTicker] + diff) * 10) / 10;

      // Ensure no negative values after adjustment
      if (result[largestTicker] < 0) {
        result[largestTicker] = 0;

        // If we still can't make it 100, adjust the selected slider
        const finalTotal = Object.values(result).reduce(
          (sum, val) => sum + val,
          0
        );
        if (Math.abs(finalTotal - 100) >= 0.1) {
          result[ticker] =
            Math.round((result[ticker] + (100 - finalTotal)) * 10) / 10;
        }
      }
    }
  }

  // After all calculations, do a final check and force to exactly 100
  const finalSum = Object.values(result).reduce((sum, val) => sum + val, 0);
  if (Math.abs(finalSum - 100) < 0.1 && finalSum !== 100) {
    // Find any non-zero allocation to adjust
    for (const t of [...otherTickers, ticker]) {
      if (result[t] > 0) {
        result[t] = Math.round((result[t] + (100 - finalSum)) * 10) / 10;
        break;
      }
    }
  }

  return result;
}
