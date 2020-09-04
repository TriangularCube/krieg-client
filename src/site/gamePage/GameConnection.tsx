import React, { FC, ReactElement, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'

import { CircularProgress, Typography } from '@material-ui/core'

import { getTargetWSUrl } from '../../util/apiTarget'
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'

import { MessageSystem } from '../../game/gameDataInterface'
import { GameDisplay } from './GameDisplay'

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

const GameState = {
    Loading: 'loading',
    Active: 'active',
    Error: 'error',
    Dropped: 'dropped',
}

export const GameConnection: FC = (): ReactElement => {
    const { gameId } = useParams()

    const [gameState, dispatchGameState] = useReducer(
        (state, newState) => {
            return newState
        },
        { state: GameState.Loading }
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
                {
                    gameId,
                },
                true
            )) as GetTokenResult
            if (!result.success) {
                console.log(result)
                dispatchGameState({
                    state: GameState.Error,
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
                    {
                        token: joinToken,
                    },
                    true
                )) as GetErrorResult
                console.log(result)

                dispatchGameState({ state: GameState.Error })
            }

            webConnection.onopen = () => {
                webConnection.onclose = () => {
                    cleanUp()
                    dispatchGameState({ state: GameState.Dropped })
                }

                messageSystem = new MessageSystem(webConnection)

                messageSystem.registerListener(
                    GameSetupCode.ConnectionDropped,
                    () => {
                        cleanUp()
                        dispatchGameState({ state: GameState.Dropped })
                    }
                )

                const connectTimeout = setTimeout(() => {
                    if (gameState.state === GameState.Loading) {
                        // We're taking too long, something's wrong
                        cleanUp()
                        dispatchGameState({ state: GameState.Dropped })
                    }
                }, 10000) // 10 Seconds

                messageSystem.registerListener(
                    GameSetupCode.HandshakeComplete,
                    () => {
                        clearTimeout(connectTimeout)
                        dispatchGameState({
                            state: GameState.Active,
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
        case GameState.Loading:
            return <CircularProgress />
        case GameState.Active:
            return <GameDisplay messageSystem={gameState.messageSystem} />
        case GameState.Dropped:
            return <Typography>Connection Lost</Typography>
        case GameState.Error:
        default:
            // TODO Refresh, then possibly log out
            return <Typography>There has been an error</Typography>
    }
}
