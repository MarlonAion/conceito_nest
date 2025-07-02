import { CanActivate, ExecutionContext } from '@nestjs/common';
import { RoutePolicyGuard } from './route-policy.guard';
import { AuthTokenGuard } from './auth-token.guard';

export class AuthAndPolicyGuard implements CanActivate {
  constructor(
    private readonly routePolicyGurad: RoutePolicyGuard,
    private readonly authTokenGuard: AuthTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthValid = await this.authTokenGuard.canActivate(context);

    if (!isAuthValid) return false;

    return this.routePolicyGurad.canActivate(context);
  }
}
