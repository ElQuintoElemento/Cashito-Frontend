export function formatRelativeTime(
  value: string | Date | null | undefined,
  now: Date = new Date()
): string {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);
  const diffMs = now.getTime() - date.getTime();

  if (Number.isNaN(diffMs)) return '';
  if (diffMs < 0) return 'Just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfGiven = new Date(date);
  startOfGiven.setHours(0, 0, 0, 0);

  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfGiven.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (dayDiff === 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';

  return date.toLocaleDateString('es-PE', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
