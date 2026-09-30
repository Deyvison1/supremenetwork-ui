import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sn-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  label = input<string>('');
  variant = input<'raised' | 'stroked' | 'flat' | 'icon'>('raised');
  icon = input<string>('');
  disabled = input<boolean>(false);
  routerLinkTo = input<string | null>(null);
  ariaLabel = input<string>('');
  title = input<string>('');

  click = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.click.emit(event);
  }
}