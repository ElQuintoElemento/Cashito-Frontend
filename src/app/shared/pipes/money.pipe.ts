import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyService } from '../../core/config/currency.service';
import { formatMoney } from '../utils/money-format';

@Pipe({
  name: 'money',
  standalone: true,
})
export class MoneyPipe implements PipeTransform {
  private readonly currencyService = inject(CurrencyService);

  transform(
    amount: number | null | undefined,
    originalCurrency: string,
    convert = false
  ): string {
    if (amount == null) return '';
    const value = convert
      ? this.currencyService.convert(amount, originalCurrency)
      : amount;
    const displayCurrency = convert
      ? this.currencyService.currency()
      : originalCurrency;
    return formatMoney(value, displayCurrency);
  }
}
