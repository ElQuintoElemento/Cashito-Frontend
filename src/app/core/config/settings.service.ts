import { Injectable } from '@angular/core';
import { APP_SETTINGS } from './app.settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  get apiUrl() {
    return APP_SETTINGS.apiUrl;
  }

  get defaultLanguage() {
    return APP_SETTINGS.defaultLanguage;
  }

  get currency() {
    return APP_SETTINGS.currency;
  }
}
