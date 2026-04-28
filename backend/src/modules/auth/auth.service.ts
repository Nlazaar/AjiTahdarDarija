import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existing) throw new ConflictException('Cet email est déjà utilisé');

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: { email: dto.email.toLowerCase(), name: dto.name ?? null, passwordHash },
      });
      return this.buildResponse(user);
    } catch (e) {
      this.logger.error('Register failed', (e as Error)?.message ?? e);
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return this.buildResponse(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        streak: true,
        hearts: true,
        createdAt: true,
        // Préférences UI synchronisées
        langTrack: true,
        preferredMascot: true,
        nodeShape: true,
        pathStyle: true,
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      avatar?: string;
      name?: string;
      // Prefs UI synchronisées entre devices
      langTrack?: 'DARIJA' | 'MSA' | 'RELIGION';
      preferredMascot?: string | null;
      nodeShape?: string | null;
      pathStyle?: string | null;
    },
  ) {
    // Whitelist : on ne laisse passer que les champs connus pour éviter
    // les écritures arbitraires dans User via le PATCH.
    const ALLOWED_TRACKS = new Set(['DARIJA', 'MSA', 'RELIGION']);
    const ALLOWED_SHAPES = new Set(['star', 'circle', 'arch', 'hex', 'medallion', 'crown']);
    const ALLOWED_PATHS  = new Set(['serpentin', 'calligraphie']);

    const safeData: Record<string, unknown> = {};
    if (typeof data.avatar === 'string') safeData.avatar = data.avatar;
    if (typeof data.name === 'string') safeData.name = data.name;
    if (data.langTrack && ALLOWED_TRACKS.has(data.langTrack)) safeData.langTrack = data.langTrack;
    if (data.preferredMascot === null || typeof data.preferredMascot === 'string') {
      safeData.preferredMascot = data.preferredMascot;
    }
    if (data.nodeShape === null || (typeof data.nodeShape === 'string' && ALLOWED_SHAPES.has(data.nodeShape))) {
      safeData.nodeShape = data.nodeShape;
    }
    if (data.pathStyle === null || (typeof data.pathStyle === 'string' && ALLOWED_PATHS.has(data.pathStyle))) {
      safeData.pathStyle = data.pathStyle;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: safeData,
      select: {
        id: true, email: true, name: true, avatar: true,
        langTrack: true, preferredMascot: true, nodeShape: true, pathStyle: true,
      },
    });
    return updated;
  }

  /** RGPD — Exporter toutes les données de l'utilisateur (droit à la portabilité) */
  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        progress: true,
        vocabularies: true,
        badges: true,
        analyticsEvents: { take: 1000, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    // Masquer le hash du mot de passe
    const { passwordHash: _pw, ...safeUser } = user as any;
    return { exportedAt: new Date().toISOString(), data: safeUser };
  }

  /** RGPD — Supprimer le compte et anonymiser toutes les données PII */
  async deleteAccount(userId: string) {
    const anonymous = `deleted_${userId.slice(0, 8)}`;
    // Anonymiser les données PII (email, nom, avatar)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `${anonymous}@deleted.invalid`,
        name: 'Utilisateur supprimé',
        avatar: null,
        passwordHash: '',
        isDeleted: true,
      },
    });
    // Supprimer les messages de conversation
    await this.prisma.conversationMessage.deleteMany({ where: { userId } });
    // Anonymiser les événements analytiques
    await this.prisma.analyticsEvent.updateMany({
      where: { userId },
      data: { userId: null },
    });
    this.logger.log(`Account deleted and anonymized: ${userId}`);
    return { message: 'Compte supprimé avec succès' };
  }

  private buildResponse(user: { id: string; email: string; name?: string | null }) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    const token = this.jwt.sign(payload);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
