import { PrismaService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEntity } from '@app/shared/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          id: user.id,
          sub: user.id,
          email: user.email,
          role: user.role,
        };

        return {
          status: true,
          accessToken: await this.jwtService.signAsync(payload),
          user: payload,
        };
      }
    }

    return { status: false, error: 'Invalid Email or Password' };
  }
}
