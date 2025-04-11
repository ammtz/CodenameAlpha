export interface PortfolioAllocation {
  [ticker: string]: number; // ticker: allocation percentage
}

export interface OptimizationParams {
  alphaTarget: number;
  riskLevel: number;
}

export interface OptimizationScenario {
  risk: number;
  alpha: number;
  allocations: PortfolioAllocation;
}

export interface OptimizationResult {
  scenarios: OptimizationScenario[];
  currentAllocation: PortfolioAllocation;
}

export interface RiskAnalysisResult {
  allocation: PortfolioAllocation;
  performanceMetrics: {
    [metric: string]: number | string;
  };
  riskMetrics: {
    [metric: string]: number | string;
  };
  historicalPerformance: {
    date: string;
    value: number;
  }[];
  drawdowns: number[];
  correlationMatrix: {
    [ticker: string]: {
      [ticker: string]: number;
    };
  };
  stressTests: {
    [scenario: string]: number;
  };
  valueAtRisk: {
    [confidence: string]: number;
  };
  expectedShortfall: {
    [confidence: string]: number;
  };
}
