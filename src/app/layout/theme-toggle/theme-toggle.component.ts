import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/config/theme.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      (click)="toggle()"
      class="group relative flex h-8 w-[60px] items-center rounded-full border border-border bg-muted p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      [attr.aria-label]="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      <div 
        class="absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 ease-in-out"
        [class.translate-x-[30px]]="isDark"
      >
        <lucide-icon *ngIf="!isDark" name="sun" class="h-3.5 w-3.5 text-foreground transition-opacity duration-300"></lucide-icon>
        <lucide-icon *ngIf="isDark" name="moon" class="h-3.5 w-3.5 text-foreground transition-opacity duration-300"></lucide-icon>
      </div>
      <div class="flex w-full justify-between px-1">
        <lucide-icon name="sun" class="h-3.5 w-3.5 text-muted-foreground"></lucide-icon>
        <lucide-icon name="moon" class="h-3.5 w-3.5 text-muted-foreground"></lucide-icon>
      </div>
    </button>
  `
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
