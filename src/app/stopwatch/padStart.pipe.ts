import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'padStart'})
export class PadStartPipe implements PipeTransform {
  transform(value: number, decorator = '0', length = 2): string {
    return String(value).padStart(length, decorator)
  }
}