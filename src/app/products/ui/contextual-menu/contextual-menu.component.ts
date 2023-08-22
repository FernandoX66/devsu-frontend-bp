import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../data-access/models/product.model';

@Component({
  selector: 'app-contextual-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contextual-menu.component.html',
  styleUrls: ['./contextual-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextualMenuComponent {
  @Input({ required: true }) isLast!: boolean;
  @Input({ required: true }) id!: string;

  @Output() deleteProduct = new EventEmitter<Product['id']>();

  showMenu = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
