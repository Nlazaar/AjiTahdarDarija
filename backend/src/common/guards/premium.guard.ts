import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const user = req.user
    if (!user) return false
    if (user.subscriptionStatus === 'active') return true
    if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date()) return true
    return false
  }
}
