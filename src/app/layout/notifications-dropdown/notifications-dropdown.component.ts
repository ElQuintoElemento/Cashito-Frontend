import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../shared/ui/button/button.directive';
import { DropdownMenuComponent, DropdownSeparatorComponent } from '../../shared/ui/dropdown-menu/dropdown-menu.component';
import { formatRelativeTime } from '../../shared/utils/relative-time';
import { NotificationM, NotificationType, normalizeNotificationType } from '../../features/notifications/domain/models/notification.model';
import { NotificationsService } from '../../features/notifications/infrastructure/services/notifications.service';

interface NotificationStyle {
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface NotificationView extends NotificationStyle {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonDirective, DropdownMenuComponent, DropdownSeparatorComponent],
  template: `
    <app-dropdown-menu #dropdown [isOpen]="isOpen" menuClass="w-80">
      <!-- TRIGGER -->
      <button
        trigger
        appButton
        variant="ghost"
        size="icon"
        class="relative rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
        (click)="toggle()"
      >
        <lucide-icon name="bell" class="w-5 h-5"></lucide-icon>
        <span *ngIf="hasUnread()" class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
      </button>

      <!-- CONTENT -->
      <div class="flex items-center justify-between px-3 py-2">
        <span class="text-sm font-semibold text-foreground/90">Notifications</span>
        <button
          class="text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:pointer-events-none disabled:opacity-50"
          [disabled]="!hasUnread()"
          (click)="markAllAsRead($event)"
        >
          Mark all as read
        </button>
      </div>
      
      <app-dropdown-separator></app-dropdown-separator>

      <div class="max-h-[340px] overflow-y-auto scrollbar-thin flex flex-col">
        <ng-container *ngIf="notifications().length > 0; else emptyOrLoading">
          <button 
            *ngFor="let notif of notifications(); trackBy: trackById"
            (click)="markAsRead(notif.id, $event)"
            class="flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/50 group border-l-2 relative"
            [class.border-transparent]="notif.read"
            [class.border-primary]="!notif.read"
            [ngClass]="{'bg-primary/5': !notif.read}"
          >
            <!-- ICON -->
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 shadow-sm border border-border/50" [ngClass]="notif.iconBg">
              <lucide-icon [name]="notif.icon" class="w-4 h-4" [ngClass]="notif.iconColor"></lucide-icon>
            </div>

            <!-- CONTENT -->
            <div class="flex-1 space-y-1 overflow-hidden">
              <p class="text-sm font-medium leading-none" [class.text-foreground]="!notif.read" [class.text-muted-foreground]="notif.read">
                {{ notif.title }}
              </p>
              <p class="text-xs text-muted-foreground/80 line-clamp-2">
                {{ notif.message }}
              </p>
              <p class="text-[10px] font-medium text-muted-foreground/60 pt-0.5">
                {{ notif.time }}
              </p>
            </div>

            <!-- UNREAD DOT -->
            <div *ngIf="!notif.read" class="w-2 h-2 rounded-full bg-primary absolute right-3 top-4"></div>
          </button>
        </ng-container>

        <ng-template #emptyOrLoading>
          <div *ngIf="loading(); else emptyState" class="py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
            <lucide-icon name="loader-2" class="w-8 h-8 mb-2 opacity-30 animate-spin"></lucide-icon>
            <p class="text-sm font-medium">Loading notifications</p>
          </div>
        </ng-template>

        <ng-template #emptyState>
          <div class="py-8 text-center flex flex-col items-center justify-center text-muted-foreground">
            <lucide-icon name="bell-off" class="w-8 h-8 mb-2 opacity-20"></lucide-icon>
            <p class="text-sm font-medium">All caught up</p>
            <p class="text-xs opacity-70">No new notifications</p>
          </div>
        </ng-template>
      </div>

      <app-dropdown-separator *ngIf="notifications().length > 0"></app-dropdown-separator>
      
      <div class="p-1" *ngIf="notifications().length > 0">
        <button appButton variant="ghost" class="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground">
          View all notifications
        </button>
      </div>
    </app-dropdown-menu>
  `
})
export class NotificationsDropdownComponent implements OnInit {
  private notificationsService = inject(NotificationsService);

  isOpen = false;
  
  @ViewChild('dropdown') dropdown!: DropdownMenuComponent;

  readonly loading = this.notificationsService.loading$;
  readonly hasUnread = this.notificationsService.hasUnread$;
  readonly notifications = computed<NotificationView[]>(() =>
    this.notificationsService.notifications$().map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      time: formatRelativeTime(notification.createdAt),
      read: notification.isRead,
      ...this.styleFor(notification),
    }))
  );

  ngOnInit(): void {
    this.notificationsService.loadUnreadCount();
  }

  toggle(): void {
    const shouldLoad = !this.dropdown.isOpen;
    this.dropdown.toggle();
    this.isOpen = this.dropdown.isOpen;

    if (shouldLoad) {
      this.notificationsService.load();
    }
  }

  markAsRead(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationsService.markAsRead(id);
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationsService.markAllAsRead();
  }

  trackById(_index: number, item: NotificationView): number {
    return item.id;
  }

  private styleFor(notification: NotificationM): NotificationStyle {
    switch (normalizeNotificationType(notification.type)) {
      case 'InstallmentPaid':
        return { icon: 'dollar-sign', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' };
      case 'CreditApproved':
        return { icon: 'check-circle', iconBg: 'bg-primary/10', iconColor: 'text-primary' };
      case 'CreditRejected':
        return { icon: 'x-circle', iconBg: 'bg-destructive/10', iconColor: 'text-destructive' };
      case 'CreditSimulated':
        return { icon: 'calculator', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' };
      case 'VehicleAdded':
        return { icon: 'car', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' };
      default:
        return { icon: 'bell', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' };
    }
  }
}
