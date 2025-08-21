export interface CredentialRequest {
    username?: string,
    email?: string,
    password?: string
}

export interface UserRequest extends CredentialRequest {
    userId: number
}