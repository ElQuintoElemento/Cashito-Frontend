import { Component } from '@angular/core';
import { ThemeService } from './core/config/theme.service';
import {RouterOutlet} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');
    const saved = localStorage.getItem('lang') || 'es';
    this.translate.use(saved);
  }
}
