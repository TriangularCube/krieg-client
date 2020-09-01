import React, { FC, ReactElement, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'

import { Typography, CircularProgress } from '@material-ui/core'

import { getTargetWSUrl } from '../../util/apiTarget'
import { getAuthorizationToken } from '../../util/authorization'
import { refreshToken } from '../../util/network'

import { MessageSystem } from '../../game/gameDataInterface'
import { GameDisplay } from './GameDisplay'

const GameState = {
    Loading: 'loading',
    Active: 'active',
    Dropped: 'dropped',
}

export const GameConnection: FC = (): ReactElement => {
    const { gameId } = useParams()

    const [gameState, dispatchGameState] = useReducer((state, newState) => {
        return newState
    }, GameState.Loading)

    useEffect(() => {
        let messageSystem: MessageSystem
        let webConnection: WebSocket

        const cleanUp = () => {
            webConnection.onclose = null
            messageSystem?.destroy()
            console.log('Cleaned Up')
        }

        const asyncOperation = async (): Promise<void> => {
            if (getAuthorizationToken() === null) {
                if (!(await refreshToken())) {
                    console.error('Cannot refresh')
                    // TODO Maybe redirect to bad page load
                    return
                }
            }

            webConnection = new WebSocket(
                getTargetWSUrl() +
                    `/${gameId}?sessionToken=${getAuthorizationToken()}`
            )
            webConnection.onclose = () => {
                cleanUp()
                dispatchGameState({ state: GameState.Dropped })
            }

            webConnection.onopen = () => {
                messageSystem = new MessageSystem(webConnection)

                messageSystem.registerListener('--connection dropped--', () => {
                    cleanUp()
                    dispatchGameState({ state: GameState.Dropped })
                })

                dispatchGameState({
                    state: GameState.Active,
                    messageSystem: messageSystem,
                })
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
        default:
            return <Typography>Connection Lost</Typography>
    }
}
