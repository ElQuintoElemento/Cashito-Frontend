import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../shared/ui/button/button.directive';
import { TranslateModule } from '@ngx-translate/core';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive, LucideAngularModule, ButtonDirective, TranslateModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  collapsed = signal(false);

  navItems: NavItem[] = [
    { path: '/app/dashboard', label: 'navbar.dashboard', icon: 'layout-dashboard' },
    { path: '/app/clients', label: 'navbar.clients', icon: 'users' },
    { path: '/app/vehicles', label: 'navbar.vehicles', icon: 'car' },
    { path: '/app/simulation', label: 'navbar.simulation', icon: 'calculator' },
    { path: '/app/credits', label: 'navbar.credits', icon: 'credit-card' },
  ];

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }

  trackByPath(index: number, item: NavItem) {
    return item.path;
  }
}
