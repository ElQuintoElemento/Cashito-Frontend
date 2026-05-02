import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  @Input() title: string = 'Dashboard';

  menuOpen = false;

  userName = 'John Doe';
  userRole = 'Loan Advisor';

  constructor(private authService: AuthService) {}

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
    this.authService.logout();
    window.location.href = '/login'; // simple por ahora
  }
}
