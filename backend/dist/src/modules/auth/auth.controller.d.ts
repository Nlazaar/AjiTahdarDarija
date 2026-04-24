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
        avatar: string;
        createdAt: Date;
        xp: number;
        level: number;
        streak: number;
        hearts: number;
    }>;
    updateMe(req: any, body: {
        avatar?: string;
        name?: string;
    }): Promise<{
        email: string;
        name: string;
        id: string;
        avatar: string;
    }>;
    /** RGPD — Droit à la portabilité : exporter toutes ses données */
    exportData(req: any): Promise<{
        exportedAt: string;
        data: any;
    }>;
    /** RGPD — Droit à l'effacement : supprimer le compte et anonymiser les données PII */
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
