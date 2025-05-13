export interface AuthToken {
   idToken: string;
   refreshToken: string;
   userId: string;
   expiresAt: number;
}

export interface AuthData extends AuthToken {
   email: string;
   userId: string;
}
