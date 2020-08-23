import { getTargetUrl } from './apiTarget'
import { getAuthorizationToken } from './authorization'

export interface NetworkMessage {
    success: boolean
    error?: {
        message: string
    }
    content?: Record<string, unknown>
}

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
}

export const sendMessage = async (
    method: HTTPMethod,
    path: string,
    withAuth = false,
    opt: Record<string, unknown> | null = null
): Promise<NetworkMessage> => {
    let response: NetworkMessage

    let authorizationToken = undefined

    if (withAuth) {
        authorizationToken = getAuthorizationToken()

        if (authorizationToken == null) {
            const result = await refreshToken()

            if (result.success) {
                authorizationToken = result.content.accessToken as string
            } else {
                // TODO
            }
        }

        authorizationToken = 'Bearer ' + authorizationToken
    }

    try {
        console.log('Initiating ' + path)
        const result = await useFetch(method, path, authorizationToken, opt)

        response = result

        // TODO: If token expired
    } catch (err) {
        response = {
            success: false,
            error: err,
        }
    }

    return response
}

const useFetch = async (
    method: HTTPMethod,
    path: string,
    auth: string | undefined = undefined,
    opt: Record<string, unknown> | null = null
): Promise<NetworkMessage> => {
    const result = await fetch(getTargetUrl() + path, {
        method,
        headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...opt,
    })

    return await result.json()
}

export const refreshToken = async (): Promise<NetworkMessage> => {
    return sendMessage(HTTPMethod.GET, '/refresh')
}
