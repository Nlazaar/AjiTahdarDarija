import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class PremiumGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
