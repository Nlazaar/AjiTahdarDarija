import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare function Roles(...roles: string[]): (target: any, key?: any, descriptor?: any) => void;
export declare class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
