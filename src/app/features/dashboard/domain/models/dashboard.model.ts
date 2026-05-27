export interface DashboardKPIs {
  totalClients: number;
  totalVehicles: number;
  activeCredits: number;
  totalRevenue: number;
  growthPercentage: number;
  revenueGrowthPercentage: number;
}

export interface DashboardActivity {
  id: string;
  type: 'credit' | 'client' | 'vehicle' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'info';
}

export interface DashboardChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}
