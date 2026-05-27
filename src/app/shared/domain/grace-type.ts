export type GraceType = 'None' | 'Partial' | 'Total';

export const GRACE_TYPE_OPTIONS: { value: GraceType; label: string }[] = [
  { value: 'None', label: 'None' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Total', label: 'Total' },
];

export function isGraceType(value: string): value is GraceType {
  return value === 'None' || value === 'Partial' || value === 'Total';
}
