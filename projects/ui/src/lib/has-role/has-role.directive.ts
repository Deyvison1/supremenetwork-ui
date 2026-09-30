import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthorizationService } from '../authorization/authorization.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authorizationService = inject(AuthorizationService);

  private hasView = false;

  readonly appHasRole = input.required<string[]>();

  constructor() {
    effect(() => {
      this.updateView(this.appHasRole());
    });
  }

  private updateView(roles: string[]): void {
    const hasRole = this.authorizationService.hasAnyRole(roles);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
