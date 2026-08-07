export type NotificationType =
  | 'InstallmentPaid'
  | 'CreditApproved'
  | 'CreditRejected'
  | 'CreditSimulated'
  | 'VehicleAdded';

const NOTIFICATION_TYPES: NotificationType[] = [
  'InstallmentPaid',
  'CreditApproved',
  'CreditRejected',
  'CreditSimulated',
  'VehicleAdded',
];

export interface NotificationM {
  id: number;
  title: string;
  message: string;
  type: NotificationType | string | number;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

export function normalizeNotificationType(type: NotificationM['type']): NotificationType | 'Unknown' {
  if (typeof type === 'number') {
    return NOTIFICATION_TYPES[type] ?? 'Unknown';
  }

  const normalized = String(type ?? '').trim().toLowerCase();
  return NOTIFICATION_TYPES.find(item => item.toLowerCase() === normalized) ?? 'Unknown';
}
