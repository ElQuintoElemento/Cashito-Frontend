import { Component } from '@angular/core';
import { ThemeService } from './core/config/theme.service';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [
    MainLayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private themeService: ThemeService) {
  }
}
