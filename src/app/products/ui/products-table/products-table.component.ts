import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../../data-access/models/product.model';
import { ContextualMenuComponent } from '../contextual-menu/contextual-menu.component';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, ContextualMenuComponent],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent {
  @Input() products: Product[] = [];
}
