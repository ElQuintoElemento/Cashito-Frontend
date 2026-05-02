import { Routes } from '@angular/router';

// layouts
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

const MainLayoutComponent = () =>
  import('./layout/main-layout/main-layout.component')
    .then(m => m.MainLayoutComponent);

// pages (lazy por feature)
const DashboardPage = () =>
  import('./features/dashboard/presentation/pages/dashboard-page/dashboard-page.component')
    .then(m => m.DashboardPageComponent);

const ClientsPage = () =>
  import('./features/clients/presentation/pages/clients-page/clients-page.component')
    .then(m => m.ClientsPageComponent);

const VehiclesPage = () =>
  import('./features/vehicles/presentation/pages/vehicles-page/vehicles-page.component')
    .then(m => m.VehiclesPageComponent);

const SimulationPage = () =>
  import('./features/simulation/presentation/pages/simulation-page/simulation-page.component')
    .then(m => m.SimulationPageComponent);

const CreditsPage = () =>
  import('./features/credits/presentation/pages/credits-page/credits-page.component')
    .then(m => m.CreditsPageComponent);

const LoginPage = () =>
  import('./features/auth/presentation/pages/login-page/login-page.component')
    .then(m => m.LoginPageComponent);

const RegisterPage = () =>
  import('./features/auth/presentation/pages/register-page/register-page.component')
    .then(m => m.RegisterPageComponent);

export const routes: Routes = [

  // 🔐 AUTH
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: LoginPage },
      { path: 'register', loadComponent: RegisterPage }
    ]
  },

  // 🔁 redirect root
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // 🧱 MAIN APP
  {
    path: 'app',
    loadComponent: MainLayoutComponent,
    children: [

      { path: 'dashboard', loadComponent: DashboardPage },
      { path: 'clients', loadComponent: ClientsPage },
      { path: 'vehicles', loadComponent: VehiclesPage },
      { path: 'simulation', loadComponent: SimulationPage },
      { path: 'credits', loadComponent: CreditsPage },

      // default dentro del layout
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // ❌ 404
  {
    path: '**',
    redirectTo: '/app/dashboard'
  }
];
