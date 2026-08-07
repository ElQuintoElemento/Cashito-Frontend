import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsApi } from '../api/notifications.api';
import { NotificationM } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private api = inject(NotificationsApi);

  private notifications = signal<NotificationM[]>([]);
  private unreadCount = signal(0);
  private loading = signal(false);
  private loaded = false;

  readonly notifications$ = this.notifications.asReadonly();
  readonly unreadCount$ = this.unreadCount.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly hasUnread$ = computed(() => this.unreadCount() > 0);

  load(force = false): void {
    if (this.loading() || (this.loaded && !force)) return;

    this.loading.set(true);
    this.api.getAll().pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => {
        const notifications = (res ?? []).map(item => ({ ...item }));
        this.notifications.set(notifications);
        this.unreadCount.set(notifications.filter(item => !item.isRead).length);
        this.loaded = true;
      },
      error: () => {
        this.loaded = false;
      },
    });
  }

  loadUnreadCount(): void {
    this.api.getUnreadCount().subscribe({
      next: (res) => this.unreadCount.set(res?.count ?? 0),
    });
  }

  markAsRead(id: number): void {
    const current = this.notifications();
    const target = current.find(item => item.id === id);
    if (!target || target.isRead) return;

    this.notifications.set(
      current.map(item => item.id === id ? { ...item, isRead: true } : item)
    );
    this.unreadCount.update(count => Math.max(0, count - 1));

    this.api.markAsRead(id).subscribe({
      error: () => {
        this.notifications.set(current);
        this.loadUnreadCount();
      },
    });
  }

  markAllAsRead(): void {
    const current = this.notifications();
    if (!this.unreadCount() && current.every(item => item.isRead)) return;

    this.notifications.set(current.map(item => ({ ...item, isRead: true })));
    this.unreadCount.set(0);

    this.api.markAllAsRead().subscribe({
      error: () => {
        this.notifications.set(current);
        this.loadUnreadCount();
      },
    });
  }
}
