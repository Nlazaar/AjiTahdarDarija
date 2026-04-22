import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

export interface SavedFile {
  /** Clé interne stable (inclut chemin relatif, ex: "cities/tanger-abc123.webp"). */
  key: string;
  /** URL publique absolue ou relative selon le driver. */
  url: string;
}

export interface StorageService {
  save(buffer: Buffer, key: string, mime: string): Promise<SavedFile>;
  delete(key: string): Promise<void>;
}

/**
 * Implémentation disque local (phase b) : écrit dans `backend/uploads/`.
 * L'URL renvoyée est relative au backend (`/uploads/...`). Le frontend
 * la préfixe avec NEXT_PUBLIC_API_URL au rendu.
 *
 * Migration future vers S3/Cloudinary : créer `S3Storage implements StorageService`
 * et switcher via un provider Nest (pas de changement d'appelant).
 */
@Injectable()
export class LocalDiskStorage implements StorageService {
  private readonly logger = new Logger(LocalDiskStorage.name);
  private readonly root = join(process.cwd(), 'uploads');

  async save(buffer: Buffer, key: string, _mime: string): Promise<SavedFile> {
    const fullPath = join(this.root, key);
    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    this.logger.log(`Saved ${key} (${buffer.length} bytes)`);
    return { key, url: `/uploads/${key}` };
  }

  async delete(key: string): Promise<void> {
    const fullPath = join(this.root, key);
    try {
      await fs.unlink(fullPath);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') throw err;
    }
  }
}

export const STORAGE = Symbol('STORAGE');
