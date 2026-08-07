import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import {APP_SETTINGS} from '../config/app.settings';

export abstract class BaseService {

  protected base = APP_SETTINGS.apiUrl;
  protected http: HttpClient = inject(HttpClient);

  protected handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
