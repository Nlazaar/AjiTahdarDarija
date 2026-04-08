import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SignalementDto } from './signalement.controller';

@Injectable()
export class SignalementService {
  private readonly logger = new Logger(SignalementService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp-mail.outlook.com',
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SIGNALEMENT_EMAIL,
      pass: process.env.HOTMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: true },
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
        from: `"AjiTahdar 🇲🇦" <${process.env.SIGNALEMENT_EMAIL}>`,
        to: process.env.SIGNALEMENT_EMAIL,
        subject: `🚨 Signalement — ${dto.phase ?? 'leçon'}`,
        text: body,
      });
      this.logger.log(`Signalement envoyé (${dto.reasons.length} raison(s))`);
    } catch (err) {
      this.logger.error('Échec envoi signalement', err);
    }
  }
}
