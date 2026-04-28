import { Controller, Post, Get, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateMe(
    @Request() req: any,
    @Body() body: {
      avatar?: string;
      name?: string;
      langTrack?: 'DARIJA' | 'MSA' | 'RELIGION';
      preferredMascot?: string | null;
      nodeShape?: string | null;
      pathStyle?: string | null;
    },
  ) {
    return this.authService.updateProfile(req.user.id, body);
  }

  /** RGPD — Droit à la portabilité : exporter toutes ses données */
  @UseGuards(JwtGuard)
  @Get('me/export')
  exportData(@Request() req: any) {
    return this.authService.exportUserData(req.user.id);
  }

  /** RGPD — Droit à l'effacement : supprimer le compte et anonymiser les données PII */
  @UseGuards(JwtGuard)
  @Delete('me')
  deleteAccount(@Request() req: any) {
    return this.authService.deleteAccount(req.user.id);
  }
}
