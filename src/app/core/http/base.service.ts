import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {environment} from '../../../environments/environmet';
import { throwError } from 'rxjs';

export abstract class BaseService {

  protected http: HttpClient = inject(HttpClient);
  protected baseUrl = environment.serverBaseUrl;

  protected handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
