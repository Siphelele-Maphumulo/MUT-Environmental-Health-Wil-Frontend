import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'yearFormat' })
export class YearFormatPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '1': return '1st Year';
      case '2': return '2nd Year';
      case '3': return '3rd Year';
      case '4': return '4th Year';
      default: return 'Unknown';
    }
  }
}