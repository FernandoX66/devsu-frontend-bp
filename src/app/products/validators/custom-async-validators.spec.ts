import { TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../data-access/services/products.service';
import { Observable, of } from 'rxjs';
import { CustomAsyncValidators } from './custom-async-validators';

class ProductsServiceStub {
  private result = false;

  checkExistence(): Observable<boolean> {
    return of(this.result);
  }

  setResult(result: boolean): void {
    this.result = result;
  }
}

describe('CustomAsyncValidators', () => {
  let productsService: ProductsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductsService,
          useClass: ProductsServiceStub,
        },
      ],
    });

    productsService = TestBed.inject(ProductsService);
  }));

  it('should set exists error if the provided product id already exists', fakeAsync(() => {
    ((<unknown>productsService) as ProductsServiceStub).setResult(true);

    const control = new FormControl('test-id', {
      asyncValidators: [CustomAsyncValidators.checkExistance(productsService)],
    });

    flush();
    expect(control.hasError('exists')).toBeTrue();
  }));

  it('should not set exists error if the provided product id is available', fakeAsync(() => {
    const control = new FormControl('test-id', {
      asyncValidators: [CustomAsyncValidators.checkExistance(productsService)],
    });

    flush();
    expect(control.hasError('exists')).toBeFalse();
  }));
});
