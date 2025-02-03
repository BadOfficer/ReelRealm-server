import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './types/user.interface';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUser({email, username, password}: CreateUserDto): Promise<{message: string}> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if(user) {
            throw new BadRequestException(`User with email - ${email} is exist!`);
        }

        const hashedPassword = await this.hashPassword(password);

        await this.prismaService.user.create({
            data: {username, email, password: hashedPassword}
        })

        return {
            message: `User - ${username} has been created!`
        }
    }

    async updateUser(id: string, userRequestDto: UpdateUserDto): Promise<{message: string}> {
        await this.findUserById(id);

        await this.prismaService.user.update({
            where: {id}, 
            data: {...userRequestDto}
        })

        return {
            message: `User - ${userRequestDto.username} has been updated!`
        } 
    }

    async deleteUser(id: string): Promise<{message: string}> {
        const user = await this.findUserById(id);

        await this.prismaService.user.delete({
            where: {id}
        })

        return {message: `User - ${user.username} has been deleted!`}
    }

    async findAllUsers(): Promise<IUser[]> {
        const users = await this.prismaService.user.findMany();
        
        return users.map(user => {
            return {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                isConfirmed: user.isConfirmed
            }
        });
    }


    async findUserById(id: string): Promise<IUser> {
        try {
            const user = await this.prismaService.user.findUnique({where: {id}});

            return {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                isConfirmed: user.isConfirmed
            }
        } catch (e) {
            throw new NotFoundException(`User with id - ${id} not found!`)
        }
    }

    async findUserByEmail(email: string): Promise<IUser & {password: string}> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {email}
            })

            return {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                password: user.password,
                isConfirmed: user.isConfirmed
            }
        } catch (e) {
            throw new NotFoundException(`User with email - ${email} not found!`)
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
