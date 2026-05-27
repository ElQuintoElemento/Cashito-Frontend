export interface DashboardKpis {
  totalClients: number;
  totalVehicles: number;
  activeCredits: number;
  totalCreditVolume: number;
  currency?: string;
}

export interface DashboardRecentClient {
  id: number;
  fullName: string;
  dni: string;
  phone: string;
  email: string;
}

export interface DashboardRecentVehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
}

export interface DashboardPortfolioSummary {
  totalCredits: number;
  totalVolume: number;
  averageInterestRate: number;
  currency?: string;
}
