export interface CredentialPayload {
    username?: string,
    email?: string,
    password?: string
}

export interface UserPayload {
    userId: number,
    username?: string,
    email?: string,
    password?: string
}