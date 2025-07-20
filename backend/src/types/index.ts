export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Optional for OAuth users
    provider?: 'google' | 'firebase'; // Provider for OAuth users
}

export interface AuthToken {
    token: string;
    expiresIn: number;
}

export interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
}