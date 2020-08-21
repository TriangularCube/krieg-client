let authorizationToken: string | null = null

export const getAuthorizationToken = (): string => authorizationToken

export const setAuthorizationToken = (newToken: string | null): void => {
    authorizationToken = newToken
}
