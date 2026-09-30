import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  imports: [MatIcon, MatButtonModule],
  selector: 'app-page-header',
  styleUrl: './page-header.scss',
  templateUrl: './page-header.html',
})
export class PageHeader {
  private readonly router = inject(Router);

  titleInput = input<string>('');
  pathToBack = input<string>('');
  isGrid = input<boolean>(false);

  title = computed(() => this.titleInput() || 'Título');

  goBack(): void {
    this.router.navigateByUrl(this.pathToBack());
  }
}