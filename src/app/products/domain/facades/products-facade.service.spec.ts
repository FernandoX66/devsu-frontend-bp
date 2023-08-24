import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductsFacade } from './products-facade.service';
import { ProductsService } from '../../data-access/services/products.service';
import { mockProduct, mockProducts } from '../../../test/mocks';
import { of } from 'rxjs';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ selector: 'app-component-stub', template: '', providers: [ProductsFacade] })
class ComponentStub {
  private readonly productsFacade = inject(ProductsFacade);
}

describe('ProductsFacadeService', () => {
  let service: ProductsFacade;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', {
      getAllProducts: of([{ ...mockProducts[0] }, { ...mockProducts[1] }]),
      createOneProduct: of({ ...mockProduct }),
      updateOneProduct: of({ ...mockProducts[0], name: 'test-name(updated)' }),
      deleteOneProduct: of(null),
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ComponentStub],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        ProductsFacade,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(ProductsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products and update state', () => {
    expect(productsServiceSpy.getAllProducts).toHaveBeenCalled();
    expect(service.paginatedProducts()).toEqual(mockProducts);
  });

  it('should filter products', fakeAsync(() => {
    service.searchControl.setValue('2');
    tick(500);

    expect(service.paginatedProducts()).toEqual([mockProducts[1]]);
  }));

  it('should get products according to pagination', () => {
    service.productsPerPage = 1;
    service.paginationControl.setValue('2');

    expect(service.paginatedProducts()).toEqual([mockProducts[1]]);
  });

  it('should create a product and update the state', () => {
    service.createOneProduct(mockProduct);

    expect(productsServiceSpy.createOneProduct).toHaveBeenCalledWith(mockProduct);
    expect(service.paginatedProducts().length).toBe(3);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/', mockProduct.id]);
  });

  it('should update a product and update the state', () => {
    service.updateOneProduct({ ...mockProducts[0], name: 'test-name(updated)' });

    expect(productsServiceSpy.updateOneProduct).toHaveBeenCalledWith({
      ...mockProducts[0],
      name: 'test-name(updated)',
    });
    expect(service.paginatedProducts()[0].name).toBe('test-name(updated)');
  });

  it('should delete a product and update the state', () => {
    const id = mockProducts[0].id;
    service.deleteOneProduct(id);

    expect(productsServiceSpy.deleteOneProduct).toHaveBeenCalledWith(id);
    expect(service.paginatedProducts().length).toBe(1);
  });

  it('should set the product to edit', () => {
    service.setEditProductId(mockProducts[0].id);

    expect(service.editProduct()).toEqual(mockProducts[0]);
  });

  it('should calculate the total pages', fakeAsync(() => {
    service.productsPerPage = 1;

    service.searchControl.setValue('t');
    tick(500);

    expect(service.totalPages()).toBe(2);
  }));

  it('should calculate the total products', fakeAsync(() => {
    service.searchControl.setValue('2');
    tick(500);

    expect(service.totalProducts()).toBe(1);
  }));

  it('should reset the product to edit', () => {
    service.setEditProductId(null);

    expect(service.editProduct()).toBeNull();
  });

  // testing effects
  it('should redirect the user to home if the product to edit is undefined', () => {
    const fixture = TestBed.createComponent(ComponentStub);
    service.setEditProductId('invalid-id');

    fixture.detectChanges();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should disable the pagination control if there are no filtered products', fakeAsync(() => {
    const fixture = TestBed.createComponent(ComponentStub);
    service.searchControl.setValue('invalid-search-term');
    tick(500);

    fixture.detectChanges();

    expect(service.paginationControl.disabled).toBeTrue();
  }));
});
