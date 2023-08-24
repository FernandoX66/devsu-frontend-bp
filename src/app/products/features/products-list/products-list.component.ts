import { Component, inject } from '@angular/core';
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

  products = this.productsFacade.filteredProducts;
  perPage = this.productsFacade.perPage;
  searchControl = this.productsFacade.searchControl;
  paginationControl = this.productsFacade.paginationControl;

  onDeleteProduct(id: Product['id']): void {
    this.productsFacade.deleteOneProduct(id);
  }
}
