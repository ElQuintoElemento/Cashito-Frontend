import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { ButtonDirective } from '../../shared/ui/button/button.directive';

import {
  DropdownMenuComponent,
  DropdownSeparatorComponent,
} from '../../shared/ui/dropdown-menu/dropdown-menu.component';

import { NotificationsService } from '../../features/notifications/infrastructure/services/notifications.service';

import { Notification as NotificationModel } from '../../features/notifications/domain/models/notification.model';

import { formatRelativeTime } from '../../shared/utils/relative-time';

interface NotificationVM {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LucideAngularModule,
    ButtonDirective,
    DropdownMenuComponent,
    DropdownSeparatorComponent,
  ],

  template: `
    <app-dropdown-menu #dropdown menuClass="w-80">

      <!-- TRIGGER -->
      <button
        trigger
        appButton
        variant="ghost"
        size="icon"
        type="button"
        class="relative rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
        (click)="dropdown.toggle()"
      >
        <lucide-icon
          name="bell"
          class="w-5 h-5"
        ></lucide-icon>

        <span
          *ngIf="unreadCount() > 0"
          class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background animate-pulse"
        ></span>
      </button>

      <!-- HEADER -->
      <div class="flex items-center justify-between px-3 py-2">

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-foreground">
            Notifications
          </span>

          <span class="text-[11px] text-muted-foreground">
            {{ unreadCount() }} unread
          </span>
        </div>

        <button
          type="button"
          class="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          (click)="markAllAsRead()"
          [disabled]="markingAll() || loading() || unreadCount() === 0"
        >
          Mark all as read
        </button>

      </div>

      <app-dropdown-separator></app-dropdown-separator>

      <!-- CONTENT -->
      <div class="max-h-[340px] overflow-y-auto scrollbar-thin flex flex-col">

        <!-- LOADING -->
        <ng-container *ngIf="loading(); else notificationsContent">

          <ng-container *ngFor="let _ of skeleton; trackBy: trackByIndex">

            <div class="flex items-start gap-3 px-3 py-3 border-l-2 border-transparent">

              <div
                class="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0 mt-0.5"
              ></div>

              <div class="flex-1 space-y-2 overflow-hidden">

                <div
                  class="h-3.5 w-3/4 rounded bg-muted animate-pulse"
                ></div>

                <div
                  class="h-2.5 w-full rounded bg-muted animate-pulse"
                ></div>

                <div
                  class="h-2 w-2/5 rounded bg-muted animate-pulse"
                ></div>

              </div>

            </div>

          </ng-container>

        </ng-container>

        <!-- LIST -->
        <ng-template #notificationsContent>

          <ng-container
            *ngIf="notifications().length > 0; else emptyState"
          >

            <button
              *ngFor="let notif of notifications()"
              type="button"
              (click)="markAsRead(notif.id)"
              class="relative flex items-start gap-3 px-3 py-3 text-left transition-colors border-l-2 hover:bg-accent/50"
              [class.border-primary]="!notif.read"
              [class.border-transparent]="notif.read"
              [ngClass]="{
                'bg-primary/5': !notif.read
              }"
              [disabled]="
                notif.read ||
                markingAll() ||
                isMarking(notif.id)
              "
            >

              <!-- ICON -->
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 border border-border/50 shadow-sm"
                [ngClass]="notif.iconBg"
              >
                <lucide-icon
                  [name]="notif.icon"
                  class="w-4 h-4"
                  [ngClass]="notif.iconColor"
                ></lucide-icon>
              </div>

              <!-- BODY -->
              <div class="flex-1 min-w-0 space-y-1">

                <div class="flex items-start justify-between gap-2">

                  <p
                    class="text-sm font-medium leading-none truncate"
                    [class.text-foreground]="!notif.read"
                    [class.text-muted-foreground]="notif.read"
                  >
                    {{ notif.title }}
                  </p>

                  <div
                    *ngIf="!notif.read"
                    class="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"
                  ></div>

                </div>

                <p
                  class="text-xs leading-relaxed text-muted-foreground/80 line-clamp-2"
                >
                  {{ notif.message }}
                </p>

                <p
                  class="text-[10px] font-medium text-muted-foreground/60 pt-0.5"
                >
                  {{ notif.time }}
                </p>

              </div>

            </button>

          </ng-container>

        </ng-template>

        <!-- EMPTY -->
        <ng-template #emptyState>

          <div
            class="py-10 px-4 flex flex-col items-center justify-center text-center text-muted-foreground"
          >

            <div
              class="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-3"
            >
              <lucide-icon
                name="bell-off"
                class="w-7 h-7 opacity-30"
              ></lucide-icon>
            </div>

            <p class="text-sm font-medium">
              All caught up
            </p>

            <p class="text-xs opacity-70 mt-1">
              No new notifications
            </p>

          </div>

        </ng-template>

      </div>

      <!-- FOOTER -->
      <ng-container
        *ngIf="!loading() && notifications().length > 0"
      >

        <app-dropdown-separator></app-dropdown-separator>

        <div class="p-1">

          <button
            appButton
            variant="ghost"
            type="button"
            class="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            View all notifications
          </button>

        </div>

      </ng-container>

    </app-dropdown-menu>
  `,
})
export class NotificationsDropdownComponent implements OnInit {

  private notificationsService = inject(NotificationsService);

  readonly skeleton = [0, 1, 2, 3, 4];

  readonly loading =
    this.notificationsService.loading$;

  readonly unreadCount =
    this.notificationsService.unreadCount$;

  readonly markingAll =
    this.notificationsService.markingAll$;

  readonly markingIds =
    this.notificationsService.markingIds$;

  readonly notifications = computed<NotificationVM[]>(() => {
    return this.notificationsService
      .notifications$()
      .map(notification => this.toVM(notification));
  });

  ngOnInit(): void {
    this.notificationsService.load();
  }

  isMarking(id: number): boolean {
    return this.markingIds().has(id);
  }

  markAsRead(id: number): void {

    if (this.markingAll()) {
      return;
    }

    this.notificationsService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  trackByIndex(index: number): number {
    return index;
  }

  private toVM(
    notification: NotificationModel
  ): NotificationVM {

    const meta = this.getTypeMeta(notification.type);

    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      time:
        formatRelativeTime(notification.createdAt) ||
        'Just now',
      read: notification.isRead,
      icon: meta.icon,
      iconBg: meta.iconBg,
      iconColor: meta.iconColor,
    };
  }

  private getTypeMeta(
    type: string
  ): {
    icon: string;
    iconBg: string;
    iconColor: string;
  } {

    switch (type) {

      case 'InstallmentPaid':
        return {
          icon: 'banknote',
          iconBg: 'bg-emerald-500/10',
          iconColor: 'text-emerald-500',
        };

      case 'CreditApproved':
        return {
          icon: 'check-circle',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
        };

      case 'CreditRejected':
        return {
          icon: 'x-circle',
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
        };

      case 'CreditSimulated':
        return {
          icon: 'calculator',
          iconBg: 'bg-violet-500/10',
          iconColor: 'text-violet-500',
        };

      case 'VehicleAdded':
        return {
          icon: 'car',
          iconBg: 'bg-blue-500/10',
          iconColor: 'text-blue-500',
        };

      default:
        return {
          icon: 'bell',
          iconBg: 'bg-muted',
          iconColor: 'text-muted-foreground',
        };
    }
  }
}
