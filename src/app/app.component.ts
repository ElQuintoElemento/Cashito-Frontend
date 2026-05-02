import { Component } from '@angular/core';
import { ThemeService } from './core/config/theme.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private themeService: ThemeService) {
  }
}
