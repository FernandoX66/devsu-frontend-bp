import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { mockProducts } from 'src/app/test/mocks';
import { environment } from 'src/environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let controller: HttpTestingController;
  let baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductsService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    service.getAllProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const http = controller.expectOne(`${baseUrl}/bp/products`);
    expect(http.request.method).toBe('GET');
    http.flush(mockProducts);
  });

  it('should create one product', () => {
    service.createOneProduct(mockProducts[0]).subscribe((product) => {
      expect(product).toEqual(mockProducts[0]);
    });

    const http = controller.expectOne(`${baseUrl}/bp/products`);
    expect(http.request.method).toBe('POST');
    http.flush(mockProducts[0]);
  });

  it('should update one product', () => {
    service.updateOneProduct(mockProducts[0]).subscribe((product) => {
      expect(product).toEqual(mockProducts[0]);
    });

    const http = controller.expectOne(`${baseUrl}/bp/products`);
    expect(http.request.method).toBe('PUT');
    http.flush(mockProducts[0]);
  });

  it('should delete one product', () => {
    service.deleteOneProduct(mockProducts[0].id).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const http = controller.expectOne(`${baseUrl}/bp/products?id=${mockProducts[0].id}`);
    expect(http.request.method).toBe('DELETE');
    http.flush({});
  });

  it('should check existence', () => {
    service.checkExistence(mockProducts[0].id).subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const http = controller.expectOne(
      `${baseUrl}/bp/products/verification?id=${mockProducts[0].id}`
    );
    expect(http.request.method).toBe('GET');
    http.flush(true);
  });
});
