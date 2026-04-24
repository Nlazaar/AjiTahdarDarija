import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService);
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
    getProfile(userId: string): Promise<{
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
    updateProfile(userId: string, data: {
        avatar?: string;
        name?: string;
    }): Promise<{
        email: string;
        name: string;
        id: string;
        avatar: string;
    }>;
    /** RGPD — Exporter toutes les données de l'utilisateur (droit à la portabilité) */
    exportUserData(userId: string): Promise<{
        exportedAt: string;
        data: any;
    }>;
    /** RGPD — Supprimer le compte et anonymiser toutes les données PII */
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    private buildResponse;
}
