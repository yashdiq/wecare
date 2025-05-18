import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const token =
      req.headers.authorization?.split('Bearer ')[1] ??
      req.headers['Authorization']?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // console.log('payload', payload);
      const userData = await this.prismaService.user.findFirst({
        where: {
          id: {
            equals: payload.sub ?? '',
          },
        },
      });

      req.user = userData;
      // console.log('userData', userData);
      return true;
    } catch (error) {
      console.log('err:', error);
      throw new UnauthorizedException();
    }
  }
}
