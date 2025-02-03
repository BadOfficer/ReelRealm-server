import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  @HttpCode(200)
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('sign-in')
  @HttpCode(200)
  async login(
    @Body() authDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.login(authDto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('access-token')
  @HttpCode(200)
  async getNewTokens(@Req() req: Request, @Res() res: Response) {
    const _refreshToken =
      req.cookies[this.configService.get('REFRESH_TOKEN_NAME')];

    if (!_refreshToken) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token is invalid!');
    }

    const { refreshToken, ...response } =
      await this.authService.refreshTokens(_refreshToken);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return { message: 'You have been logout' };
  }
}
