import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from 'src/dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
        select: {
          name: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }

      const isPasswordValid = await argon.verify(
        user.password,
        loginDto.password,
      );

      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid credentials');
      }

      return {
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      throw error instanceof ForbiddenException
        ? error
        : new ForbiddenException('An unexpected error occurred');
    }
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
        },
        select: {
          name: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ForbiddenException('User with this email already exists');
      }

      throw new ForbiddenException('An unexpected error occurred');
    }
  }
}
