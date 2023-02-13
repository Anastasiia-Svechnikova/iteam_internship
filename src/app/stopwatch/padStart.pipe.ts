import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'padStart'})
export class PadStartPipe implements PipeTransform {
  transform(value: number, decorator = '0', length = 2): string {
    return String(value).padStart(length, decorator)
  }
}