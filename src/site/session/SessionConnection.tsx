import React, { FC, ReactElement, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'

import { CircularProgress, Typography } from '@material-ui/core'

import { getTargetWSUrl } from '../../util/apiTarget'
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'

import { MessageSystem } from '../../phaser/game/gameDataInterface'
import { SessionDisplay } from './SessionDisplay'

import { GameSetupCode } from '../../../shared/MessageCodes'

interface GetTokenResult extends NetworkMessage {
    content: {
        token: string
    }
}
interface GetErrorResult extends NetworkMessage {
    content: {
        error: Record<string, unknown>
    }
}

const SessionState = {
    Loading: 'loading',
    Active: 'active',
    Error: 'error',
    Dropped: 'dropped',
}

export const SessionConnection: FC = (): ReactElement => {
    const { sessionId } = useParams()

    const [gameState, dispatchGameState] = useReducer(
        (state, newState) => {
            return newState
        },
        { state: SessionState.Loading }
    )

    useEffect(() => {
        let messageSystem: MessageSystem
        let webConnection: WebSocket

        const cleanUp = () => {
            webConnection && (webConnection.onclose = null)
            messageSystem?.destroy()
            console.log('Cleaned Up')
        }

        const asyncOperation = async (): Promise<void> => {
            const result = (await sendMessage(
                HTTPMethod.POST,
                '/get-join-token',
                true,
                {
                    sessionId,
                }
            )) as GetTokenResult
            if (!result.success) {
                console.log(result)
                dispatchGameState({
                    state: SessionState.Error,
                    error: result.error,
                })
                return
            }

            const joinToken = result.content.token

            webConnection = new WebSocket(
                getTargetWSUrl() + `/?token=${joinToken}`
            )
            webConnection.onclose = async () => {
                cleanUp()

                const result = (await sendMessage(
                    HTTPMethod.POST,
                    '/get-join-error',
                    true,
                    {
                        token: joinToken,
                    }
                )) as GetErrorResult
                console.log(result)

                dispatchGameState({ state: SessionState.Error })
            }

            webConnection.onopen = () => {
                webConnection.onclose = () => {
                    cleanUp()
                    dispatchGameState({ state: SessionState.Dropped })
                }

                messageSystem = new MessageSystem(webConnection)

                // Clean up dropped sessions
                messageSystem.registerListener(
                    GameSetupCode.ConnectionDropped,
                    () => {
                        cleanUp()
                        dispatchGameState({ state: SessionState.Dropped })
                    }
                )

                const connectTimeout = setTimeout(() => {
                    if (gameState.state === SessionState.Loading) {
                        // We're taking too long, something's wrong
                        cleanUp()
                        dispatchGameState({ state: SessionState.Dropped })
                    }
                }, 10000) // 10 Seconds

                messageSystem.registerListener(
                    GameSetupCode.HandshakeComplete,
                    () => {
                        clearTimeout(connectTimeout)
                        dispatchGameState({
                            state: SessionState.Active,
                            messageSystem: messageSystem,
                        })
                    }
                )
            }
        }

        asyncOperation()

        return cleanUp
    }, [])

    // TODO Auto Reconnect Feature after dropped connection

    switch (gameState.state) {
        case SessionState.Loading:
            return <CircularProgress />
        case SessionState.Active:
            return <SessionDisplay messageSystem={gameState.messageSystem} />
        case SessionState.Dropped:
            return <Typography>Connection Lost</Typography>
        case SessionState.Error:
        default:
            // TODO Refresh, then possibly log out
            return <Typography>There has been an error</Typography>
    }
}
