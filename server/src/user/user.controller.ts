import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestUserDto } from './dto/request-user.dto';
import { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userRequestDto: RequestUserDto): Promise<User> {
    return await this.userService.createUser(userRequestDto);
  }
}
