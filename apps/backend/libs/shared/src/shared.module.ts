import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [PrismaService, JwtStrategy],
  exports: [PrismaService, JwtModule, PassportModule],
})
export class SharedModule {}
