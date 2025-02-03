import { Role } from "@prisma/client";

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: Role;
    isConfirmed: boolean;
}