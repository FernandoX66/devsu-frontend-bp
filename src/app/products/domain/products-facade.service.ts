import { Injectable, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../data-access/services/products.service';
import { ProductsState } from './state.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

const initialState: Readonly<ProductsState> = {
  products: [],
  searchTerm: '',
  perPage: 2,
};

@Injectable()
export class ProductsFacade {
  private readonly productsService = inject(ProductsService);
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
}
