import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ProductsTableComponent } from '../../ui/products-table/products-table.component';
import { RouterLink } from '@angular/router';
import { ProductsFacade } from '../../domain/facades/products-facade.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../data-access/models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [CommonModule, ButtonComponent, ProductsTableComponent, RouterLink, ReactiveFormsModule],
})
export class ProductsListComponent {
  private readonly productsFacade = inject(ProductsFacade);

  paginationControl = this.productsFacade.paginationControl;
  searchControl = this.productsFacade.searchControl;
  products = this.productsFacade.paginatedProducts;
  totalProducts = this.productsFacade.totalProducts;
  pages = computed(() =>
    new Array(this.productsFacade.totalPages()).fill(null).map((_, i) => i + 1)
  );
  currentPage = this.productsFacade.currentPage;

  onDeleteProduct(id: Product['id']): void {
    this.productsFacade.deleteOneProduct(id);
  }
}
