export type NotificationType = string;

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationDto {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}
