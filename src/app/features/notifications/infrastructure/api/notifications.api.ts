import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import { NotificationM, UnreadCountResponse } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/notifications`;

  getAll() {
    return this.http.get<NotificationM[]>(this.base);
  }

  getUnreadCount() {
    return this.http.get<UnreadCountResponse>(`${this.base}/unread-count`);
  }

  markAsRead(id: number) {
    return this.http.put<void>(`${this.base}/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.put<void>(`${this.base}/read-all`, {});
  }
}
