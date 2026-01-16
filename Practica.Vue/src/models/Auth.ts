export const UserRole = {
    Admin: 1,
    Teacher: 2,
    Student: 3
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface RegisterUserDto {
    username: string;
    email: string;
    password?: string;
    role: UserRoleType;
}

export interface LoginDto {
    email: string;
    password?: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}