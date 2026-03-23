import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // TODO: implement real JWT validation using Passport + passport-jwt
    const request = context.switchToHttp().getRequest();
    // placeholder: allow all for now
    return true;
  }
}
