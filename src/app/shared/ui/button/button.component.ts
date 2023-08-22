import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonColor, ButtonType } from './button.types';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() color: ButtonColor = 'primary';
  @Input() width = 'auto';
  @Input() type: ButtonType = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
}
