import { Injectable } from '@angular/core';
import { format, addYears, isBefore, set, addMinutes, addDays } from 'date-fns';

@Injectable()
export class DateFacade {
  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  addMinutes(date: Date, hours: number): Date {
    return addMinutes(date, hours);
  }

  addDays(date: Date, days: number): Date {
    return addDays(date, days);
  }

  addYears(date: Date, years: number): Date {
    return addYears(date, years);
  }

  isBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare);
  }

  resetTime(date: Date): Date {
    return set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  }
}
