import { TestBed } from '@angular/core/testing';

import { DateFacadeService } from './date-facade.service';

describe('DateFacadeService', () => {
  let service: DateFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
