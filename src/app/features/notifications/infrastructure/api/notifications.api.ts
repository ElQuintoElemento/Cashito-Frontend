import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import { Notification, NotificationDto } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/notifications`;

  getAll() {
    return this.http.get<NotificationDto[]>(this.base);
  }

  getUnreadCount() {
    return this.http.get<number>(`${this.base}/unread-count`);
  }

  markAsRead(id: number) {
    return this.http.put<void>(`${this.base}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.put<void>(`${this.base}/read-all`, {});
  }
}

