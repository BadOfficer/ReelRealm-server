import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/user/types/user.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IResponseTokens } from './types/response-tokens.interface';
import { IJwtPayload } from './types/jwt-payload.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IUser> {
    const user = await this.userService.findUserByEmail(email);

    const validatedPassword = await bcrypt.compare(password, user.password);

    if (!validatedPassword)
      throw new UnauthorizedException('Invalid Credentials!');

    const { password: _, ...userData } = user;

    return userData;
  }

  private issueTokens(payload: IJwtPayload): IResponseTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async register(dto: CreateUserDto): Promise<{ message: string }> {
    return await this.userService.createUser(dto);
  }

  async login(dto: SignInDto): Promise<IUser & IResponseTokens> {
    const user = await this.validateUser(dto);

    const tokens = this.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { ...user, ...tokens };
  }
  async refreshTokens(refreshToken: string): Promise<IUser & IResponseTokens> {
    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Refresh Token is invalid!');

    const user = await this.userService.findUserByEmail(result.email);

    const tokens = this.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { ...user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expaireIn = new Date();
    expaireIn.setDate(
      expaireIn.getDate() + this.configService.get('REFRESH_TOKEN_EXPAIRES_IN'),
    );
    res.cookie(this.configService.get('REFRESH_TOKEN_NAME'), refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expaireIn,
      sameSite: 'none',
      secure: true,
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.configService.get('REFRESH_TOKEN_NAME'), '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      sameSite: 'none',
      secure: true,
    });
  }
}
