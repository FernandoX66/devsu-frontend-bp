import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateFacade } from '../facades/date-facade.service';

export class CustomValidators {
  static beforeDate(dateToCompare: Date, dateFacade: DateFacade): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(`${control.value}T00:00:00`);
      return dateFacade.isBefore(selectedDate, dateToCompare) ? { beforeDate: true } : null;
    };
  }
}
