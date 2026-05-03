import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private snack = inject(MatSnackBar);

  success(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
      panelClass: ['bg-green-500', 'text-white']
    });
  }

  error(message: string) {
    this.snack.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: ['bg-red-500', 'text-white']
    });
  }

  info(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
      panelClass: ['bg-blue-500', 'text-white']
    });
  }
}
