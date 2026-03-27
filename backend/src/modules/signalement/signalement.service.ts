import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SignalementDto } from './signalement.controller';

@Injectable()
export class SignalementService {
  private readonly logger = new Logger(SignalementService.name);

  private transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: 'najib_lazaar@hotmail.com',
      pass: process.env.HOTMAIL_PASSWORD,
    },
    tls: { ciphers: 'SSLv3' },
  });

  async send(dto: SignalementDto) {
    const reasonsList = dto.reasons.map(r => `• ${r}`).join('\n');
    const body = `
Nouveau signalement reçu sur AjiTahdarDarija

Leçon : ${dto.lessonId ?? 'inconnue'}
Phase  : ${dto.phase ?? 'inconnue'}

Raisons signalées :
${reasonsList}

---
Envoyé automatiquement depuis l'application.
    `.trim();

    try {
      await this.transporter.sendMail({
        from: '"AjiTahdar 🇲🇦" <najib_lazaar@hotmail.com>',
        to: 'najib_lazaar@hotmail.com',
        subject: `🚨 Signalement — ${dto.phase ?? 'leçon'}`,
        text: body,
      });
      this.logger.log(`Signalement envoyé (${dto.reasons.length} raison(s))`);
    } catch (err) {
      this.logger.error('Échec envoi signalement', err);
    }
  }
}
