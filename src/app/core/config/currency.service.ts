import { Injectable, signal, computed } from '@angular/core';

export type Currency = 'PEN' | 'USD';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly STORAGE_KEY = 'cashito-currency';
  private readonly EXCHANGE_RATE_PEN_TO_USD = 0.27; // 1 PEN = 0.27 USD
  private readonly EXCHANGE_RATE_USD_TO_PEN = 3.75; // 1 USD = 3.75 PEN

  // Reactive global state
  private _currency = signal<Currency>('PEN');
  
  // Expose readonly signal
  public currency = this._currency.asReadonly();

  constructor() {
    this.loadCurrency();
  }

  setCurrency(c: Currency) {
    this._currency.set(c);
    localStorage.setItem(this.STORAGE_KEY, c);
  }

  toggleCurrency() {
    this.setCurrency(this._currency() === 'PEN' ? 'USD' : 'PEN');
  }

  /**
   * Visually transforms an amount from its original currency to the current global display currency.
   */
  convert(amount: number, originalCurrency: Currency | string): number {
    const target = this._currency();
    
    // If it's already the target currency, return as is
    if (originalCurrency === target) return amount;

    // Convert to target
    if (target === 'USD' && originalCurrency === 'PEN') {
      return amount * this.EXCHANGE_RATE_PEN_TO_USD;
    }
    
    if (target === 'PEN' && originalCurrency === 'USD') {
      return amount * this.EXCHANGE_RATE_USD_TO_PEN;
    }

    // Fallback if unknown
    return amount;
  }

  private loadCurrency() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Currency | null;
    if (saved === 'PEN' || saved === 'USD') {
      this._currency.set(saved);
    }
  }
}
