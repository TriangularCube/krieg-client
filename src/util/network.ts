import { getTargetUrl } from './apiTarget'

export interface NetworkMessage {
    success: boolean
    error?: {
        message: string
    }
    content?: Record<string, unknown>
}

export const registerUser = async (
    displayName: string,
    email: string,
    password1: string,
    password2: string
): Promise<NetworkMessage> => {
    let response: NetworkMessage
    try {
        const result = await fetch(getTargetUrl() + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                displayName,
                email,
                password1,
                password2,
            }),
        })

        response = await result.json()
    } catch (err) {
        response = {
            success: false,
            error: err,
        }
    }

    return response
}

export const login = async (
    email: string,
    password: string
): Promise<NetworkMessage> => {
    let response: NetworkMessage
    try {
        const result = await fetch(getTargetUrl() + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        response = await result.json()
    } catch (err) {
        response = {
            success: false,
            error: err,
        }
    }

    return response
}

export const refreshToken = async (): Promise<NetworkMessage> => {
    let response: NetworkMessage
    try {
        const result = await fetch(getTargetUrl() + '/refresh')

        response = await result.json()
    } catch (err) {
        response = {
            success: false,
            error: err,
        }
    }

    return response
}
