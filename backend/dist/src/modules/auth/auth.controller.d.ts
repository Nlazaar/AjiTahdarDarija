import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    me(req: any): Promise<{
        email: string;
        name: string;
        id: string;
        createdAt: Date;
        xp: number;
        level: number;
        streak: number;
        hearts: number;
    }>;
}
