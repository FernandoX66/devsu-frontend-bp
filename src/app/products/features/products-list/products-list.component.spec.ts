import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';
import { ProductsFacade } from '../../domain/facades/products-facade.service';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsFacadeSpy: jasmine.SpyObj<ProductsFacade>;

  beforeEach(() => {
    productsFacadeSpy = jasmine.createSpyObj('ProductsFacade', ['deleteOneProduct'], {
      paginationControl: new FormControl(0),
      searchControl: new FormControl(''),
      paginatedProducts: signal([]),
      totalProducts: signal(0),
      totalPages: signal(1),
      currentPage: signal(1),
    });

    TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [
        { provide: ProductsFacade, useValue: productsFacadeSpy },
        provideRouter([]),
        provideLocationMocks(),
      ],
    });
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties', () => {
    expect(component.products()).toEqual([]);
    expect(component.searchControl).toBeTruthy();
    expect(component.paginationControl).toBeTruthy();
    expect(component.totalProducts()).toBe(0);
    expect(component.currentPage()).toBe(1);
    expect(component.pages()).toEqual([1]);
  });

  it('should delete a product', () => {
    component.onDeleteProduct('test-id');

    expect(productsFacadeSpy.deleteOneProduct).toHaveBeenCalledWith('test-id');
  });
});
