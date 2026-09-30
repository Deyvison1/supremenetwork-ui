export abstract class AuthorizationService {
  abstract hasAnyRole(roles: string[], clientId?: string): boolean;
}
