import { getTargetUrl } from './apiTarget'

export interface NetworkMessage {
    success: boolean
    error?: {
        message: string
    }
    content?: Record<string, unknown>
}

export const registerUser = async (
    username: string,
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
                username,
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
        console.error(response)
    }

    return response
}
