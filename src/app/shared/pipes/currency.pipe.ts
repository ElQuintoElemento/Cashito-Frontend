import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPen',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null) return '';

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(value);
  }
}
