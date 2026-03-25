import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  listItems() {
    return this.shopService.listItems();
  }

  @Get('inventory')
  getInventory(@Request() req: any) {
    return this.shopService.getUserInventory(req.user.id);
  }

  @Post('buy/:key')
  buy(@Param('key') key: string, @Request() req: any) {
    return this.shopService.buyItem(req.user.id, key);
  }
}
