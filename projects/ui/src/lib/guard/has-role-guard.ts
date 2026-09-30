import { CanActivateFn } from '@angular/router';
import { AuthorizationService } from '../authorization/authorization.service';
import { inject } from '@angular/core';

export const hasRoleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    return inject(AuthorizationService).hasAnyRole(roles);
  };
};
