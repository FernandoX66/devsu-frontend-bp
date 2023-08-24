import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFormComponent } from './products-form.component';
import { ProductsService } from '../../data-access/services/products.service';
import { ProductsFacade } from '../../domain/facades/products-facade.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFacade } from '../../domain/facades/date-facade.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { mockProduct, mockProductFormValue } from '../../test/mocks';

const createDateFacadeSpy = () => {
  return jasmine.createSpyObj('DateFacade', {
    formatDate: '2000-01-01',
    resetTime: new Date('2000-01-01:00:00:00'),
    addYears: new Date('2001-01-01:00:00:00'),
    addMinutes: new Date('2000-01-01:00:01:00'),
    addDays: new Date('2000-01-02:00:00:00'),
    isBefore: false,
  });
};

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;
  let productsFacadeSpy: jasmine.SpyObj<ProductsFacade>;
  let dateFacadeSpy: jasmine.SpyObj<DateFacade>;

  describe('when there is a product to edit', () => {
    beforeEach(() => {
      productsFacadeSpy = jasmine.createSpyObj(
        'ProductsFacade',
        ['createOneProduct', 'updateOneProduct', 'setEditProductId'],
        {
          editProduct: signal({ ...mockProduct }),
        }
      );

      dateFacadeSpy = createDateFacadeSpy();

      TestBed.configureTestingModule({
        imports: [ProductsFormComponent, ReactiveFormsModule],
        providers: [
          { provide: ProductsService, useValue: { checkExistence: () => of(false) } },
          { provide: ProductsFacade, useValue: productsFacadeSpy },
          { provide: DateFacade, useValue: dateFacadeSpy },
        ],
      });
      fixture = TestBed.createComponent(ProductsFormComponent);
      component = fixture.componentInstance;
      component.id = mockProduct.id;
      fixture.detectChanges();
    });

    it('should assign values the values from the product to the form', () => {
      const formValue = component.form.getRawValue();
      expect(formValue.id).toBe(mockProduct.id);
      expect(formValue.name).toBe(mockProduct.name);
      expect(formValue.description).toBe(mockProduct.description);
      expect(formValue.logo).toBe(mockProduct.logo);
    });

    it('should update a products with the values from the form and not change date if offset is negative', () => {
      component.offset = -360;
      component.form.setValue(mockProductFormValue);

      component.submitForm();

      expect(productsFacadeSpy.updateOneProduct).toHaveBeenCalled();
      expect(dateFacadeSpy.addDays).not.toHaveBeenCalled();
    });
  });

  describe('when there is no product to edit', () => {
    beforeEach(() => {
      productsFacadeSpy = jasmine.createSpyObj(
        'ProductsFacade',
        ['createOneProduct', 'updateOneProduct', 'setEditProductId'],
        {
          editProduct: signal(null),
        }
      );

      dateFacadeSpy = createDateFacadeSpy();

      TestBed.configureTestingModule({
        imports: [ProductsFormComponent, ReactiveFormsModule],
        providers: [
          { provide: ProductsService, useValue: { checkExistence: () => of(false) } },
          { provide: ProductsFacade, useValue: productsFacadeSpy },
          { provide: DateFacade, useValue: dateFacadeSpy },
        ],
      });
      fixture = TestBed.createComponent(ProductsFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get a control', () => {
      expect(component.getControl('name')).toBeTruthy();
    });

    it('should assign values to the date_revision control when date_release changes', () => {
      component.getControl('date_release').setValue('2000-01-01');

      expect(dateFacadeSpy.formatDate).toHaveBeenCalledWith(new Date('2000-01-01:00:00:00'));
    });

    it('should not submit the form if it is invalid', () => {
      component.submitForm();

      expect(productsFacadeSpy.createOneProduct).not.toHaveBeenCalled();
      expect(productsFacadeSpy.updateOneProduct).not.toHaveBeenCalled();
    });

    it('should create a product with the values from the form if there is no id and change date if offset is positive', () => {
      component.form.setValue(mockProductFormValue);

      component.submitForm();

      expect(productsFacadeSpy.createOneProduct).toHaveBeenCalled();
      expect(dateFacadeSpy.addDays).toHaveBeenCalled();
    });
  });
});
