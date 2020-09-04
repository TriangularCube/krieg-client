import { dispatch } from './redux/reduxStore'

import { getTargetUrl } from './apiTarget'
import { setLoginState } from './redux/actions'

import { NetworkErrorCode } from '../../shared/MessageCodes.js'
import { getAuthorizationToken, setAuthorizationToken } from './authorization'

export interface NetworkMessage {
    success: boolean
    error?: {
        code?: string
        message?: string
        content?: unknown
    }
    content?: unknown
}

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
}

export const sendMessage = async (
    method: HTTPMethod,
    path: string,
    withAuth = false,
    body: Record<string, unknown> = undefined,
    opt: Record<string, unknown> = undefined
): Promise<NetworkMessage> => {
    let response: NetworkMessage

    try {
        console.log('Initiating ' + path)
        let result = await useFetch(method, path, body, withAuth, opt)

        let content = await result.json()

        if (!result.ok) {
            // Some sort of network error
            return {
                success: false,
                error: {
                    code: 'Network Error', // TODO
                    content,
                },
            }
        }

        if (
            !content.success &&
            withAuth &&
            content.error.code === NetworkErrorCode.CouldNotVerifyToken &&
            (await refreshToken())
        ) {
            result = await useFetch(method, path, body, withAuth, opt)

            content = await result.json()
        }

        if (!result.ok) {
            // Some sort of network error
            return {
                success: false,
                error: {
                    code: 'Network Error', // TODO
                    content,
                },
            }
        }

        response = content
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
    body: Record<string, unknown> = undefined,
    withAuth = false,
    { headers, ...rest }: Record<string, unknown> = { headers: null }
): Promise<Response> => {
    return await fetch(getTargetUrl() + path, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: withAuth
                ? `Bearer ${getAuthorizationToken()}`
                : undefined,
            ...(headers as Record<string, unknown>),
        },
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    })
}

export const refreshToken = async (): Promise<boolean> => {
    const fetchResult = await useFetch(HTTPMethod.GET, '/refresh')

    if (fetchResult.ok) {
        const resultJSON = await fetchResult.json()
        if (resultJSON.success) {
            setAuthorizationToken(resultJSON.content.accessToken)
            return true
        } else if (
            resultJSON.error.code === NetworkErrorCode.CouldNotVerifyToken
        ) {
            // Initiate Logout
            dispatch(setLoginState(false))
            return false
        }
    }

    console.log('Error while refreshing token')
    // TODO

    return false
}
