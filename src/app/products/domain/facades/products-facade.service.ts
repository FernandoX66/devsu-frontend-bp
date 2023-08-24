import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../../data-access/services/products.service';
import { ProductsState } from '../state/state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Product } from '../../data-access/models/product.model';

const initialState: Readonly<ProductsState> = {
  products: [],
  searchTerm: '',
  perPage: 5,
  editProductId: null,
};

@Injectable()
export class ProductsFacade {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  private stateSignal = signal<ProductsState>(initialState);
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly paginationControl = new FormControl(this.stateSignal().perPage, { nonNullable: true });

  readonly filteredProducts = computed(() => {
    const searchTerm = this.stateSignal().searchTerm;

    return this.stateSignal()
      .products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, this.stateSignal().perPage);
  });
  readonly perPage = computed(() => this.stateSignal().perPage);
  readonly editProduct = computed(() => {
    const editProductId = this.stateSignal().editProductId;

    return editProductId
      ? this.stateSignal().products.find((product) => product.id === editProductId)
      : null;
  });

  private getAllProducts$ = this.productsService.getAllProducts();

  constructor() {
    this.getAllProducts$.pipe(takeUntilDestroyed()).subscribe((products) => {
      this.stateSignal.update((state) => ({ ...state, products }));
    });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(), distinctUntilChanged(), debounceTime(500))
      .subscribe((searchTerm) => this.stateSignal.update((state) => ({ ...state, searchTerm })));

    this.paginationControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((perPage) => this.stateSignal.update((state) => ({ ...state, perPage })));
  }

  createOneProduct(product: Product): void {
    this.productsService
      .createOneProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((product) => {
        this.stateSignal.update((state) => ({ ...state, products: [...state.products, product] }));
      });
  }

  updateOneProduct(product: Product): void {
    this.productsService
      .updateOneProduct(product)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((product) => {
        this.stateSignal.update((state) => {
          const products = state.products.map((p) => (p.id === product.id ? product : p));
          return { ...state, products };
        });
      });
  }

  deleteOneProduct(id: Product['id']): void {
    this.productsService
      .deleteOneProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.stateSignal.update((state) => {
          const products = state.products.filter((product) => product.id !== id);
          return { ...state, products };
        });
      });
  }

  setEditProductId(id: Product['id'] | null): void {
    this.stateSignal.update((state) => ({ ...state, editProductId: id }));
  }
}
