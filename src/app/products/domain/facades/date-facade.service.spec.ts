import { TestBed } from '@angular/core/testing';

import { DateFacade } from './date-facade.service';

describe('DateFacade', () => {
  let service: DateFacade;
  const date = new Date('2000-01-01:00:00:00');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateFacade],
    });

    service = TestBed.inject(DateFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format a date', () => {
    const formattedDate = service.formatDate(date);
    expect(formattedDate).toBe('2000-01-01');
  });

  it('should add minutes to a date', () => {
    const newDate = service.addMinutes(date, 10);
    expect(newDate.getMinutes()).toBe(10);
  });

  it('should add days to a date', () => {
    const newDate = service.addDays(date, 1);
    expect(newDate.getDate()).toBe(2);
  });

  it('should add years to a date', () => {
    const newDate = service.addYears(date, 1);
    expect(newDate.getFullYear()).toBe(2001);
  });

  it('should check if a date is before another date', () => {
    const newDate = service.addYears(date, 1);
    expect(service.isBefore(newDate, date)).toBeFalse();
  });

  it('should reset the time of a date', () => {
    const newDate = service.resetTime(date);
    expect(newDate.getHours()).toBe(0);
    expect(newDate.getMinutes()).toBe(0);
    expect(newDate.getSeconds()).toBe(0);
    expect(newDate.getMilliseconds()).toBe(0);
  });
});
