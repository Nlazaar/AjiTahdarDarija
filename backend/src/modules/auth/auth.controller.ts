import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() body: any) {
    return { message: 'login endpoint — implement auth logic' };
  }

  @Post('register')
  register(@Body() body: any) {
    return { message: 'register endpoint — implement auth logic' };
  }
}
