import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {ThemeToggleComponent} from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterOutlet,
    LanguageSwitcherComponent,
    ThemeToggleComponent
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
