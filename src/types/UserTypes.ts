export interface CredentialPayload {
    username?: string,
    email?: string,
    password?: string
}

export interface UserPayload extends CredentialPayload {
    userId: number
}