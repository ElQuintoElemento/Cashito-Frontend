import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {NotificationService} from '../../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError(err => {
      const message =
        err.error?.error ||
        err.error?.message ||
        'Unexpected error';

      notify.error(message);

      return throwError(() => err);
    })
  );
};
