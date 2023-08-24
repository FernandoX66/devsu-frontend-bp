import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomAsyncValidators } from '../../domain/validators/custom-async-validators';
import { ProductsService } from '../../data-access/services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateFacade } from '../../domain/facades/date-facade.service';
import { CustomValidators } from '../../domain/validators/custom-validators';
import { ProductsFacade } from '../../domain/facades/products-facade.service';
import { Product } from '../../data-access/models/product.model';

@Component({
  selector: 'app-products-form',
  standalone: true,
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
  imports: [CommonModule, ButtonComponent, ReactiveFormsModule],
})
export class ProductsFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly productsFacade = inject(ProductsFacade);
  private readonly productsService = inject(ProductsService);
  private readonly dateFacade = inject(DateFacade);

  @Input() id!: Product['id'];
  currentDate = this.dateFacade.resetTime(new Date());
  formattedCurrentDate = this.dateFacade.formatDate(this.currentDate);
  offset = this.currentDate.getTimezoneOffset();
  form = this.initializeForm();
  editProduct = this.productsFacade.editProduct;
  loading = this.productsFacade.loading;

  constructor() {
    this.getControl('date_release')
      .valueChanges.pipe(takeUntilDestroyed())
      .subscribe((releaseDate) => {
        if (!releaseDate) return;

        const selectedDate = new Date(`${releaseDate}T00:00:00`);
        this.getControl('date_revision').setValue(
          this.dateFacade.formatDate(this.dateFacade.addYears(selectedDate, 1))
        );
      });

    effect(() => {
      const product = this.editProduct();
      if (product && this.id) {
        this.assignFormValues(product);
      }
    });
  }

  ngOnInit(): void {
    this.productsFacade.setEditProductId(this.id);
  }

  getControl(controlName: string): AbstractControl {
    return this.form.get(controlName) as AbstractControl;
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.getControl(controlName);
    return control.invalid && control.touched;
  }

  resetForm(): void {
    const editProduct = this.editProduct();
    if (this.id && editProduct) {
      this.form.reset({
        ...editProduct,
        date_release: this.dateFacade.formatDate(new Date(editProduct.date_release)),
        date_revision: this.dateFacade.formatDate(new Date(editProduct.date_revision)),
      });
    } else {
      this.form.reset();
    }
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const product = this.handleTimezoneOffset();
    if (this.id) {
      this.productsFacade.updateOneProduct(product);
    } else {
      this.productsFacade.createOneProduct(product);
    }
  }

  private initializeForm() {
    return this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [CustomAsyncValidators.checkExistance(this.productsService)],
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [
        this.dateFacade.formatDate(this.currentDate),
        {
          validators: [
            Validators.required,
            CustomValidators.beforeDate(this.currentDate, this.dateFacade),
          ],
          updateOn: 'blur',
        },
      ],
      date_revision: [
        {
          value: this.dateFacade.formatDate(this.dateFacade.addYears(this.currentDate, 1)),
          disabled: true,
        },
        Validators.required,
      ],
    });
  }

  private assignFormValues(product: Product): void {
    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: this.dateFacade.formatDate(new Date(product.date_release)),
      date_revision: this.dateFacade.formatDate(new Date(product.date_revision)),
    });
    this.getControl('id').disable();
  }

  private handleTimezoneOffset() {
    const dateReleaseValue: string = this.getControl('date_release').value;
    const date_release =
      this.offset > 0
        ? this.dateFacade.formatDate(
            this.dateFacade.addDays(new Date(`${dateReleaseValue}T00:00`), 1)
          )
        : dateReleaseValue;
    const date_revision = this.dateFacade.formatDate(
      this.dateFacade.addYears(new Date(`${date_release}T00:00`), 1)
    );

    return {
      ...this.form.getRawValue(),
      date_release,
      date_revision,
    };
  }
}
