import { Component, Input, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { Router } from '@angular/router';
import {AuthStorageService} from '../../features/auth/infrastructure/services/auth-storage.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgIf, LanguageSwitcherComponent, ThemeToggleComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  @Input() title: string = 'Dashboard';

  private router = inject(Router);
  private authStorage = inject(AuthStorageService);

  menuOpen = false;

  userName = 'John Doe';
  userRole = 'Loan Advisor';

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
    this.authStorage.clear(); // 🔥 limpia token + user
    this.router.navigate(['/auth/login']); // 🔥 redirige bien
  }
}
