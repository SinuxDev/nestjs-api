import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUsers() {
    return { message: 'This route is protected and returns user data.' };
  }
}
