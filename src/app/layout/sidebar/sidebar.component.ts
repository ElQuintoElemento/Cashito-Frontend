import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  collapsed = signal(false);

  navItems: NavItem[] = [
    { path: '/app/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { path: '/app/clients', label: 'Clients', icon: 'users' },
    { path: '/app/vehicles', label: 'Vehicles', icon: 'car' },
    { path: '/app/simulation', label: 'Simulation', icon: 'calculator' },
    { path: '/app/credits', label: 'Credits', icon: 'credit-card' },
  ];

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }

  trackByPath(index: number, item: NavItem) {
    return item.path;
  }
}
