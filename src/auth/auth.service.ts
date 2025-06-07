import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '../../generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { message: 'Login successful' };
  }

  signup() {
    return { message: 'Signup successful' };
  }
}
