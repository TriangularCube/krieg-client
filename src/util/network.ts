import { dispatch } from './redux/reduxStore'

import { getTargetUrl } from './apiTarget'
import { getAuthorizationToken, setAuthorizationToken } from './authorization'
import { setLoginState } from './redux/actions'

import { NetworkErrorCode } from '../../shared/MessageCodes.js'

export interface NetworkMessage {
    success: boolean
    error?: {
        code?: string
        message?: string
        content?: unknown
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

    let haveTriedRefresh = false
    if (withAuth) {
        if (getAuthorizationToken() === null) {
            if (!(await refreshToken())) {
                return {
                    success: false,
                    error: {
                        message: 'Not logged in',
                    },
                }
            }
            haveTriedRefresh = true
        }
    }

    try {
        console.log('Initiating ' + path)
        let result = await useFetch(method, path, getAuthorizationToken(), opt)

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
            !haveTriedRefresh &&
            (await refreshToken())
        ) {
            result = await useFetch(method, path, getAuthorizationToken(), opt)

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
    auth: string | undefined = undefined,
    opt: Record<string, unknown> | null = null
): Promise<Response> => {
    return await fetch(getTargetUrl() + path, {
        method,
        headers: {
            Authorization: `Bearer ${auth}`,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...opt,
    })
}

const refreshToken = async (): Promise<boolean> => {
    const fetchResult = await useFetch(HTTPMethod.GET, '/refresh')

    if (fetchResult.ok) {
        const resultJSON = await fetchResult.json()
        if (resultJSON.success) {
            setAuthorizationToken(resultJSON.content.accessToken)
            return true
        } else if (
            resultJSON.content.error.code ===
            NetworkErrorCode.CouldNotVerifyToken
        ) {
            // Initiate Logout
            setAuthorizationToken(null)
            dispatch(setLoginState(false))
            return false
        }
    }

    console.log('Error while refreshing token')
    // TODO

    return false
}
