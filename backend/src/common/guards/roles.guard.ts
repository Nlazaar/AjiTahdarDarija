import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

export function Roles(...roles: string[]) {
  return (target: any, key?: any, descriptor?: any) => {
    Reflect.defineMetadata('roles', roles, descriptor?.value ?? target)
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const handler = context.getHandler()
    const required: string[] = Reflect.getMetadata('roles', handler) || []
    if (required.length === 0) return true
    const req = context.switchToHttp().getRequest()
    const user = req.user
    if (!user) return false
    return required.includes(user.role)
  }
}
