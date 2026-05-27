import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationsApi } from '../api/notifications.api';
import { Notification, NotificationDto } from '../../domain/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private api = inject(NotificationsApi);

  private notifications = signal<Notification[]>([]);
  private unreadCount = signal(0);
  private loading = signal(false);

  private markingIds = signal<Set<number>>(new Set());
  private markingAll = signal(false);

  readonly notifications$ = this.notifications.asReadonly();
  readonly unreadCount$ = this.unreadCount.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly markingIds$ = this.markingIds.asReadonly();
  readonly markingAll$ = this.markingAll.asReadonly();

  readonly hasUnread$ = computed(() => this.unreadCount() > 0);

  load(): void {
    this.loading.set(true);

    let pending = 2;
    const finish = () => {
      pending -= 1;
      if (pending === 0) this.loading.set(false);
    };

    this.api
      .getAll()
      .pipe(finalize(finish))
      .subscribe({
        next: (res) => this.notifications.set(this.normalize(res ?? [])),
      });

    this.api
      .getUnreadCount()
      .pipe(finalize(finish))
      .subscribe({
        next: (res) => this.unreadCount.set(Number(res ?? 0)),
      });
  }

  markAsRead(id: number): void {
    const current = this.notifications();
    const notif = current.find((n) => n.id === id);

    if (!notif || notif.isRead) return;

    const prevUnreadCount = this.unreadCount();
    const prevNotifications = current;

    this.markingIds.set(new Set([...this.markingIds(), id]));
    this.notifications.set(
      prevNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    this.unreadCount.set(Math.max(0, prevUnreadCount - 1));

    this.api
      .markAsRead(id)
      .pipe(
        finalize(() => {
          const next = new Set(this.markingIds());
          next.delete(id);
          this.markingIds.set(next);
        })
      )
      .subscribe({
        error: () => {
          this.notifications.set(
            prevNotifications.map((n) =>
              n.id === id ? { ...n, isRead: false } : n
            )
          );
          this.unreadCount.set(prevUnreadCount);
        },
      });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0 || this.markingAll()) return;

    const prevUnreadCount = this.unreadCount();
    const prevNotifications = this.notifications();
    const unreadIds = prevNotifications.filter((n) => !n.isRead).map((n) => n.id);

    this.markingAll.set(true);

    this.notifications.set(prevNotifications.map((n) => ({ ...n, isRead: true })));
    this.unreadCount.set(0);

    this.api
      .markAllAsRead()
      .pipe(
        finalize(() => {
          this.markingAll.set(false);
          this.markingIds.set(new Set());
        })
      )
      .subscribe({
        error: () => {
          this.notifications.set(
            prevNotifications.map((n) =>
              unreadIds.includes(n.id) ? { ...n, isRead: false } : n
            )
          );
          this.unreadCount.set(prevUnreadCount);
        },
      });
  }

  private normalize(dtos: NotificationDto[]): Notification[] {
    return dtos.map((d) => ({
      id: d.id,
      type: d.type,
      title: d.title,
      message: d.message,
      createdAt: d.createdAt ?? '',
      isRead: d.isRead ?? false,
    }));
  }
}

