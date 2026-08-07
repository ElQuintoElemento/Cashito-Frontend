import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 rounded-md border border-border bg-muted p-1">
      <button
        (click)="setLang('es')"
        class="flex-1 rounded-sm px-3 py-1 text-xs font-medium transition-all"
        [ngClass]="currentLang === 'es' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'"
      >
        ES
      </button>
      <button
        (click)="setLang('en')"
        class="flex-1 rounded-sm px-3 py-1 text-xs font-medium transition-all"
        [ngClass]="currentLang === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'"
      >
        EN
      </button>
    </div>
  `
})
export class LanguageSwitcherComponent {

  currentLang = 'es';

  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem('lang') || 'es';
    this.currentLang = saved;
    this.translate.use(saved);
  }

  setLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
