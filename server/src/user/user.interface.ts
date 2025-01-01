import { Role } from "@prisma/client";

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
}