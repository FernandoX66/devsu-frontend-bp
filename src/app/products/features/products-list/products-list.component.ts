import { Component, OnInit, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ProductsTableComponent } from '../../ui/products-table/products-table.component';
import { RouterLink } from '@angular/router';
import { ProductsFacade } from '../../domain/products-facade.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../data-access/models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [CommonModule, ButtonComponent, ProductsTableComponent, RouterLink, ReactiveFormsModule],
})
export class ProductsListComponent implements OnInit {
  private readonly productsFacade = inject(ProductsFacade);

  products!: Signal<Product[]>;
  perPage!: Signal<number>;
  searchControl!: FormControl<string>;
  paginationControl!: FormControl<number>;

  ngOnInit(): void {
    this.products = this.productsFacade.filteredProducts;
    this.perPage = this.productsFacade.perPage;
    this.searchControl = this.productsFacade.searchControl;
    this.paginationControl = this.productsFacade.paginationControl;
  }
}
