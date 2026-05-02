import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthStorageService} from '../../../features/auth/infrastructure/services/auth-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(AuthStorageService);
  const token = storage.getToken();

  if (
    req.url.includes('/auth/sign-in') ||
    req.url.includes('/auth/sign-up')
  ) {
    return next(req);
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
