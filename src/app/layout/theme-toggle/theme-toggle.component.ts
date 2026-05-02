import { Component } from '@angular/core';
import { ThemeService } from '../../core/config/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent {

  constructor(private themeService: ThemeService) {}

  get isDark(): boolean {
    return this.themeService.getTheme() === 'dark';
  }

  toggle(): void {
    this.themeService.toggleTheme();
  }
}
