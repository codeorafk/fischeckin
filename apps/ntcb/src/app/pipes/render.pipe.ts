import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'render',
})
export class RenderPipe implements PipeTransform {
  async transform(value: any, args?: any[]) {
    if (!args) return value;

    if (args.length <= 0) return value;

    switch (args[0]) {
      case 'datetime':
        if (!value) return '';
        value = formatDate(value, 'short', 'vi');
        return value;
      case 'date':
        if (!value) return '';
        value = formatDate(value, 'shortDate', 'vi');
        return value;
      case 'time':
        if (!value) return '';
        value = formatDate(value, 'shortTime', 'vi');
        return value;
    }
  }
}
