import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './types/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { EmailVerificationGuard } from 'src/auth/guards/email-verification.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard, EmailVerificationGuard)
  @Roles(Role.ADMIN)
  async createUser(@Body() userRequestDto: CreateUserDto): Promise<{message: string}> {
    return await this.userService.createUser(userRequestDto);
  }

  @Put(":id")
  @Auth()
  async updateUser(@Param('id') id: string, @Body() userRequestDto: UpdateUserDto): Promise<{message: string}> {
    return await this.userService.updateUser(id, userRequestDto);
  }

  @Delete(":id")
  @Auth()
  async deleteUser(@Param("id") id: string): Promise<{message: string}> {
    return await this.userService.deleteUser(id);
  }

  @Get(":id")
  @Auth()
  async getUserById(@Param('id') id: string): Promise<IUser> {
    return await this.userService.findUserById(id);
  }

  @Get()
  @Auth()
  async getUsers(): Promise<IUser[]> {
    return await this.userService.findAllUsers();
  }
}
