import { TestBed } from '@angular/core/testing';

import { ProductsFacade } from './products-facade.service';

describe('ProductsFacadeService', () => {
  let service: ProductsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
