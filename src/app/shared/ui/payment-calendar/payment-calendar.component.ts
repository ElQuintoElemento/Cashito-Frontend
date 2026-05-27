import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export interface CalendarPayment {
  number: number;
  date: string | Date;
  totalPayment: number;
  isPaid?: boolean;
  status?: string;
}

export interface CalendarMonthView {
  year: number;
  month: number;
  label: string;
  startWeekday: number;
  daysInMonth: number;
  paymentsByDay: Map<number, CalendarPayment>;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'app-payment-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="rounded-xl border border-border/60 overflow-hidden bg-card shadow-sm flex flex-col h-full min-h-[320px]">
      <div class="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border/50 shrink-0">
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded-md border border-border/60 bg-background hover:bg-muted transition-colors"
          [disabled]="!canGoPrev()"
          (click)="prevMonth()"
          aria-label="Previous month"
        >
          <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
        </button>
        <h4 class="text-sm font-semibold tracking-tight text-foreground">{{ currentMonth().label }}</h4>
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded-md border border-border/60 bg-background hover:bg-muted transition-colors"
          [disabled]="!canGoNext()"
          (click)="nextMonth()"
          aria-label="Next month"
        >
          <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

      <div class="grid grid-cols-7 border-b border-border/40 bg-muted/20 shrink-0">
        @for (d of dayAbbr; track d) {
          <div class="py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{{ d }}</div>
        }
      </div>

      <div class="grid grid-cols-7 flex-1 min-h-0">
        @for (e of leadingBlanks(); track $index) {
          <div class="h-14 border-r border-b border-border/30 bg-muted/10 last:border-r-0"></div>
        }
        @for (day of daysInMonth(); track day) {
          @if (paymentForDay(day); as payment) {
            <div
              class="relative h-14 border-r border-b border-border/30 p-1.5 flex flex-col justify-between last:border-r-0"
              [ngClass]="paymentCellClass(payment)"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold leading-none px-1.5 py-0.5 rounded-md" [ngClass]="dayBadgeClass(payment)">{{ day }}</span>
                <span class="text-[9px] font-semibold leading-none" [ngClass]="statusTextClass(payment)">#{{ payment.number }}</span>
              </div>
              <span class="text-[10px] font-semibold leading-none text-foreground/80 truncate">{{ formatPayment(payment.totalPayment) }}</span>
            </div>
          } @else {
            <div class="h-14 border-r border-b border-border/30 p-1.5 last:border-r-0 bg-background">
              <span class="text-xs text-muted-foreground/50 leading-none">{{ day }}</span>
            </div>
          }
        }
      </div>

      <div class="flex items-center gap-4 px-5 py-2.5 bg-muted/20 border-t border-border/40 shrink-0">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-primary/70"></span>
          <span class="text-[10px] text-muted-foreground">Pending</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500/70"></span>
          <span class="text-[10px] text-muted-foreground">Paid</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-destructive/70"></span>
          <span class="text-[10px] text-muted-foreground">Overdue</span>
        </div>
      </div>
    </div>
  `,
})
export class PaymentCalendarComponent implements OnChanges {
  @Input() payments: CalendarPayment[] = [];
  @Input() formatPayment: (amount: number) => string = (a) => String(a);

  private readonly paymentsSignal = signal<CalendarPayment[]>([]);
  private readonly months = computed(() => this.buildMonths(this.paymentsSignal()));
  private readonly monthIndex = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments']) {
      this.paymentsSignal.set(this.payments ?? []);
      this.monthIndex.set(0);
    }
  }

  constructor() {
    this.paymentsSignal.set(this.payments ?? []);
  }

  readonly dayAbbr = DAY_ABBR;

  currentMonth = computed(() => {
    const list = this.months();
    if (!list.length) {
      const now = new Date();
      return this.emptyMonth(now.getFullYear(), now.getMonth());
    }
    const idx = Math.min(this.monthIndex(), list.length - 1);
    return list[idx];
  });

  leadingBlanks = computed(() =>
    Array.from({ length: this.currentMonth().startWeekday }, (_, i) => i)
  );

  daysInMonth = computed(() =>
    Array.from({ length: this.currentMonth().daysInMonth }, (_, i) => i + 1)
  );

  canGoPrev(): boolean {
    return this.monthIndex() > 0;
  }

  canGoNext(): boolean {
    return this.monthIndex() < this.months().length - 1;
  }

  prevMonth(): void {
    if (this.canGoPrev()) this.monthIndex.update(i => i - 1);
  }

  nextMonth(): void {
    if (this.canGoNext()) this.monthIndex.update(i => i + 1);
  }

  paymentForDay(day: number): CalendarPayment | null {
    return this.currentMonth().paymentsByDay.get(day) ?? null;
  }

  paymentCellClass(p: CalendarPayment): Record<string, boolean> {
    return {
      'bg-emerald-500/8': !!p.isPaid,
      'bg-destructive/8': !p.isPaid && p.status === 'Overdue',
      'bg-primary/8': !p.isPaid && p.status !== 'Overdue',
    };
  }

  dayBadgeClass(p: CalendarPayment): Record<string, boolean> {
    return {
      'bg-emerald-500 text-white': !!p.isPaid,
      'bg-destructive text-destructive-foreground': !p.isPaid && p.status === 'Overdue',
      'bg-primary text-primary-foreground': !p.isPaid && p.status !== 'Overdue',
    };
  }

  statusTextClass(p: CalendarPayment): Record<string, boolean> {
    return {
      'text-emerald-600 dark:text-emerald-400': !!p.isPaid,
      'text-destructive': !p.isPaid && p.status === 'Overdue',
      'text-primary': !p.isPaid && p.status !== 'Overdue',
    };
  }

  private buildMonths(payments: CalendarPayment[]): CalendarMonthView[] {
    if (!payments.length) return [];

    const byKey = new Map<string, CalendarMonthView>();

    for (const p of payments) {
      const d = new Date(p.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;

      if (!byKey.has(key)) {
        byKey.set(key, {
          year: y,
          month: m,
          label: `${MONTH_NAMES[m]} ${y}`,
          startWeekday: new Date(y, m, 1).getDay(),
          daysInMonth: new Date(y, m + 1, 0).getDate(),
          paymentsByDay: new Map(),
        });
      }
      byKey.get(key)!.paymentsByDay.set(d.getDate(), p);
    }

    return Array.from(byKey.values()).sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.month - b.month
    );
  }

  private emptyMonth(year: number, month: number): CalendarMonthView {
    return {
      year,
      month,
      label: `${MONTH_NAMES[month]} ${year}`,
      startWeekday: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      paymentsByDay: new Map(),
    };
  }
}
