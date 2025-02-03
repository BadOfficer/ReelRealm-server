import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const {user} = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException("User not authenticated");
    }

    const dbUser = await this.userService.findUserById(user.id);

    if (!dbUser || !dbUser.isConfirmed) {
      throw new UnauthorizedException("Email not verified");
    }

    return true;
  }
}
