import { Controller, Get, Param } from '@nestjs/common'
import { PacksService } from './packs.service'

@Controller('packs')
export class PacksController {
  constructor(private svc: PacksService) {}

  @Get()
  async list() {
    return this.svc.listAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.getById(id)
  }

  @Get(':id/words')
  async words(@Param('id') id: string) {
    return this.svc.getWords(id)
  }
}
