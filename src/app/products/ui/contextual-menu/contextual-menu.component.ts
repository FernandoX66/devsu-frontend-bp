import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  showMenu = false;

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
}
