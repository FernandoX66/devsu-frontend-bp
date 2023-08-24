import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductsFacade } from './products-facade.service';
import { ProductsService } from '../../data-access/services/products.service';
import { mockProduct, mockProducts } from '../../test/mocks';
import { of } from 'rxjs';
import { Component, inject } from '@angular/core';

@Component({ selector: 'app-component-stub', template: '', providers: [ProductsFacade] })
class ComponentStub {
  private readonly productsFacade = inject(ProductsFacade);
}

describe('ProductsFacadeService', () => {
  let service: ProductsFacade;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(() => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', {
      getAllProducts: of([{ ...mockProducts[0] }, { ...mockProducts[1] }]),
      createOneProduct: of({ ...mockProduct }),
      updateOneProduct: of({ ...mockProducts[0], name: 'test-name(updated)' }),
      deleteOneProduct: of(null),
    });

    TestBed.configureTestingModule({
      declarations: [ComponentStub],
      providers: [{ provide: ProductsService, useValue: productsServiceSpy }, ProductsFacade],
    });

    service = TestBed.inject(ProductsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products and update state', () => {
    expect(productsServiceSpy.getAllProducts).toHaveBeenCalled();
    expect(service.filteredProducts()).toEqual(mockProducts);
  });

  it('should filter products', fakeAsync(() => {
    service.searchControl.setValue('2');
    tick(500);

    expect(service.filteredProducts()).toEqual([mockProducts[1]]);
  }));

  it('should get products according to pagination', () => {
    service.paginationControl.setValue(1);

    expect(service.perPage()).toBe(1);
    expect(service.filteredProducts().length).toBe(1);
  });

  it('should create a product and update the state', () => {
    service.createOneProduct(mockProduct);

    expect(productsServiceSpy.createOneProduct).toHaveBeenCalledWith(mockProduct);
    expect(service.filteredProducts().length).toBe(3);
  });

  it('should update a product and update the state', () => {
    service.updateOneProduct({ ...mockProducts[0], name: 'test-name(updated)' });

    expect(productsServiceSpy.updateOneProduct).toHaveBeenCalledWith({
      ...mockProducts[0],
      name: 'test-name(updated)',
    });
    expect(service.filteredProducts()[0].name).toBe('test-name(updated)');
  });

  it('should delete a product and update the state', () => {
    const id = mockProducts[0].id;
    service.deleteOneProduct(id);

    expect(productsServiceSpy.deleteOneProduct).toHaveBeenCalledWith(id);
    expect(service.filteredProducts().length).toBe(1);
  });

  it('should set the product to edit', () => {
    service.setEditProductId(mockProducts[0].id);

    expect(service.editProduct()).toEqual(mockProducts[0]);
  });

  it('should reset the product to edit', () => {
    service.setEditProductId(null);

    expect(service.editProduct()).toBeNull();
  });

  it('should redirect the user to home if the product to edit is undefined', () => {
    const fixture = TestBed.createComponent(ComponentStub);
    const navigateSpy = spyOn(service['router'], 'navigateByUrl');
    service.setEditProductId('invalid-id');

    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
