import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { DateFacade } from '../facades/date-facade.service';

class DateFacadeStub {
  private result = false;

  isBefore(): boolean {
    return this.result;
  }

  setResult(result: boolean): void {
    this.result = result;
  }
}

describe('CustomValidators', () => {
  let dateFacade: DateFacade;
  const date = new Date('2000-01-01:00:00:00');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DateFacade,
          useClass: DateFacadeStub,
        },
      ],
    });

    dateFacade = TestBed.inject(DateFacade);
  }));

  it('should set beforeDate error if the selected date is before the current one', () => {
    ((<unknown>dateFacade) as DateFacadeStub).setResult(true);

    const control = new FormControl('1999-01-01', [CustomValidators.beforeDate(date, dateFacade)]);

    expect(control.hasError('beforeDate')).toBeTrue();
  });

  it('should not set beforeDate error if the selected date is not before the current one', () => {
    const control = new FormControl('2001-01-01', [CustomValidators.beforeDate(date, dateFacade)]);

    expect(control.hasError('beforeDate')).toBeFalse();
  });
});
