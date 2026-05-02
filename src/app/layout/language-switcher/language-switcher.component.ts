import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.component.html'
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
