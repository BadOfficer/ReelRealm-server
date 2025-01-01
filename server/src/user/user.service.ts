import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestUserDto } from './dto/request-user.dto';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUser(userRequestDto: RequestUserDto): Promise<User> {
        const {email, username, password} = userRequestDto;

        const user = this.findUserByEmail(email);

        if(user) {
            throw new BadRequestException(`User with email - ${email} is exist!`);
        }

        const hashedPassword = await this.hashPassword(password);

        return this.prismaService.user.create({
            data: {username, email, password: hashedPassword}
        })
    }

    async updateUser(id: string, userRequestDto: RequestUserDto): Promise<User> {
        const user = await this.findUserById(id);

        if(user) {
            throw new NotFoundException(`User with id - ${id} not found!`)
        }

        return this.prismaService.user.update({
            where: {id}, 
            data: {...userRequestDto}
        })
    }

    async deleteUser(id: string): Promise<{message: string}> {
        const user = await this.findUserById(id);

        if(user) {
            throw new NotFoundException(`User with id - ${id} not found!`)
        }

        await this.prismaService.user.delete({
            where: {id}
        })

        return {message: `User - ${user.username} has been deleted!`}
    }

    async findAllUsers(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    async findUserById(id: string): Promise<User> {
        try {
            return this.prismaService.user.findUnique({where: {id}});
        } catch (e) {
            throw new NotFoundException(`User with id - ${id} not found!`)
        }
    }

    async findUserByEmail(email: string): Promise<User & {password: string}> {
        try {
            return this.prismaService.user.findUnique({
                where: {email}
            })
        } catch (e) {
            throw new NotFoundException(`User with email - ${email} not found!`)
        }
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
