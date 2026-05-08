import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DashboardKPIs, DashboardActivity, DashboardChartData } from '../../domain/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardMockService {

  getKPIs(): Observable<DashboardKPIs> {
    return of({
      totalClients: 124,
      totalVehicles: 89,
      activeCredits: 42,
      totalRevenue: 284500,
      growthPercentage: 12.5,
      revenueGrowthPercentage: 8.4
    }).pipe(delay(400)); // Simulate network latency
  }

  /*
  getRecentActivity(): Observable<DashboardActivity[]> {
    return of([
      {
        id: '1',
        type: 'payment',
        title: 'Payment Received',
        description: 'John Doe paid S/ 1,250.00 for Quota #4',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        status: 'success'
      },
      {
        id: '2',
        type: 'credit',
        title: 'New Credit Simulated',
        description: 'Toyota Yaris 2024 simulated for Jane Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        status: 'info'
      },
      {
        id: '3',
        type: 'client',
        title: 'New Client Registered',
        description: 'Michael Johnson added to the platform',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        status: 'success'
      },
      {
        id: '4',
        type: 'vehicle',
        title: 'Vehicle Registered',
        description: 'Honda Civic 2023 added to inventory',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        status: 'pending'
      }
    ]).pipe(delay(500));
  }
*/
  getRevenueChartData(): Observable<DashboardChartData> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          data: [45000, 52000, 48000, 61000, 59000, 75000]
        }
      ]
    }).pipe(delay(500));
  }
}
