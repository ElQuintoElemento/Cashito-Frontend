import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { AuthStorageService } from '../../features/auth/infrastructure/services/auth-storage.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgIf, LanguageSwitcherComponent, ThemeToggleComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authStorage = inject(AuthStorageService);

  title = 'Dashboard';
  menuOpen = false;

  userName = 'UNKNOW';
  userRole = 'Loan Advisor';



  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitleFromRoute();
        this.menuOpen = false; // bonus UX

        const user = this.authStorage.getUser();
        this.userName = user?.username ?? 'User';
      });
  }

  ngOnInit() {
    setTimeout(() => this.setTitleFromRoute());
  }

  private setTitleFromRoute() {
    let currentRoute = this.route;

    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const routeData = currentRoute?.snapshot?.data;

    this.title = routeData?.['title'] ?? 'Dashboard';
  }

  get userInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
