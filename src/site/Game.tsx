import React, { FC, ReactElement, useEffect } from 'react'

import { Container, Hidden, makeStyles, Typography } from '@material-ui/core'
import * as Phaser from 'phaser'

import {
    gameConfig,
    StartScene,
    StartSceneKey,
    MessageSystem,
} from '../game/gameConfig'
import { getTargetWSUrl } from '../util/apiTarget'

const useStylesGame = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 30,
    },
})
export const Game: FC = (): ReactElement => {
    const classes = useStylesGame()

    return (
        <Container className={classes.container}>
            {/* TODO This isn't good enough for dealing with iPad resolution */}

            <Hidden smDown implementation='js'>
                {/* Make sure this uses JS implementation to deactivate game properly */}
                <ActualGame />

                <div style={{ marginTop: 10 }}>
                    <Typography>Controller stuff?</Typography>
                </div>
            </Hidden>

            <Hidden mdUp>
                <Typography align='center'>
                    This page cannot be displayed on a small screen. We may
                    implement this in the future.
                </Typography>
            </Hidden>
        </Container>
    )
}

const useStylesActual = makeStyles({
    root: {
        maxWidth: 1280,
        maxHeight: 720,
    },
})
const ActualGame: FC = (): ReactElement => {
    const classes = useStylesActual()

    useEffect(() => {
        let game: Phaser.Game

        const webConnection = new WebSocket(getTargetWSUrl())

        webConnection.onopen = () => {
            const messageSystem = new MessageSystem(webConnection)

            console.log('Connected, starting Game Instance')
            game = new Phaser.Game(gameConfig)

            // This is a workaround to pass data into the Scene
            // https://www.html5gamedevs.com/topic/38327-pass-custom-variable-into-phasergame/
            // https://www.html5gamedevs.com/topic/36148-phaser-3-scene-phaser-2-state-passing-data-to-init-when-start/
            game.scene.add(StartSceneKey, StartScene, false)
            game.scene.start(StartSceneKey, {
                messageSystem,
            })

            webConnection.onclose = () => {
                console.log('Closed')
            }

            // Heartbeat event to prevent connection from closing
            setInterval(() => {
                messageSystem.sendNetworkMessage('heartbeat', null)
            }, 20000)
        }

        return () => {
            game?.destroy(true)
            console.log('Destroyed Game Instance')
        }
    }, [])

    return <div id='game-root' className={classes.root} />
}
