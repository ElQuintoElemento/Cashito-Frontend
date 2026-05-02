import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthStorageService} from '../../../features/auth/infrastructure/services/auth-storage.service';

export const authGuard: CanActivateFn = () => {
  const storage = inject(AuthStorageService);
  const router = inject(Router);

  const token = storage.getToken();

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (!isExpired) return true;
    } catch {}
  }

  return router.createUrlTree(['/auth']);
};
