import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';
import { ProductsService } from '../../data-access/services/products.service';
import { ProductsState, initialState } from '../state/state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { Product } from '../../data-access/models/product.model';
import { Router } from '@angular/router';

@Injectable()
export class ProductsFacade {
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private stateSignal = signal<ProductsState>(initialState);
  private filteredProducts = computed(() => {
    const filteredProductsIds = this.stateSignal().filteredProductsIds;
    const isFiltering = this.stateSignal().isFiltering;
    const products = this.stateSignal().products;

    return isFiltering
      ? products.filter((product) => filteredProductsIds.includes(product.id))
      : products;
  });

  productsPerPage = 5;

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly paginationControl = new FormControl('1', {
    nonNullable: true,
  });
  // selectors
  readonly totalProducts = computed(() => this.stateSignal().totalProducts);
  readonly currentPage = computed(() => this.stateSignal().currentPage);
  readonly totalPages = computed(() => this.stateSignal().totalPages);
  readonly editProduct = computed(() => {
    const editProductId = this.stateSignal().editProductId;

    return editProductId
      ? this.stateSignal().products.find((product) => product.id === editProductId)
      : null;
  });
  readonly loading = computed(() => this.stateSignal().loading);
  readonly paginatedProducts = computed(() => {
    const currentPage = this.currentPage();

    return this.filteredProducts().slice(
      (currentPage - 1) * this.productsPerPage,
      currentPage * this.productsPerPage
    );
  });

  constructor() {
    this.productsService
      .getAllProducts()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.setLoading(false))
      )
      .subscribe((products) => {
        this.stateSignal.update((state) => ({
          ...state,
          products,
          totalProducts: products.length,
          totalPages: Math.ceil(products.length / this.productsPerPage),
        }));
      });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(), distinctUntilChanged(), debounceTime(500))
      .subscribe((searchTerm) => {
        const filteredProductsIds = this.stateSignal()
          .products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => product.id);

        this.stateSignal.update((state) => ({
          ...state,
          isFiltering: !!searchTerm,
          currentPage: 1,
          filteredProductsIds,
          totalPages: Math.ceil(filteredProductsIds.length / this.productsPerPage),
          totalProducts: filteredProductsIds.length,
        }));
      });

    this.paginationControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((page) =>
      this.stateSignal.update((state) => ({
        ...state,
        currentPage: Number(page),
      }))
    );

    effect(() => {
      if (this.editProduct() === undefined && this.loading() === false) {
        this.router.navigateByUrl('/');
      }
    });

    effect(() => {
      this.paginationControl.setValue(this.currentPage().toString(), { emitEvent: false });
    });

    effect(() => {
      if (this.filteredProducts().length === 0) {
        this.paginationControl.disable({ emitEvent: false });
      } else {
        this.paginationControl.enable({ emitEvent: false });
      }
    });
  }

  createOneProduct(product: Product): void {
    this.setLoading(true);
    this.productsService
      .createOneProduct(product)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false))
      )
      .subscribe((product) => {
        this.stateSignal.update((state) => ({ ...state, products: [...state.products, product] }));
        this.router.navigate(['/', product.id]);
      });
  }

  updateOneProduct(product: Product): void {
    this.setLoading(true);
    this.productsService
      .updateOneProduct(product)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false))
      )
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

  private setLoading(loading: boolean): void {
    this.stateSignal.update((state) => ({ ...state, loading }));
  }
}
