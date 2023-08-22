import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { ProductsService } from '../data-access/services/products.service';
import { Observable, map } from 'rxjs';

export class CustomAsyncValidators {
  static checkExistance(productsService: ProductsService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return productsService.checkExistence(control.value).pipe(
        map((exists) => {
          return exists ? { exists: true } : null;
        })
      );
    };
  }
}
