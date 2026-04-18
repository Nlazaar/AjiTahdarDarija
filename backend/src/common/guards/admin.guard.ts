import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest()
    const adminToken = process.env.ADMIN_TOKEN
    const provided = (req.headers['x-admin-token'] as string | undefined)?.trim()
    if (!adminToken || provided !== adminToken) {
      throw new UnauthorizedException('Admin token required')
    }
    return true
  }
}
