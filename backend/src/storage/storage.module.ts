import { Global, Module } from '@nestjs/common';
import { LocalDiskStorage, STORAGE } from './storage.service';

/**
 * Storage driver (phase b = disque local). Pour passer en S3 :
 *   - créer S3Storage implements StorageService
 *   - switcher `useClass` en fonction de process.env.STORAGE_DRIVER
 */
@Global()
@Module({
  providers: [
    LocalDiskStorage,
    { provide: STORAGE, useExisting: LocalDiskStorage },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
