import React, { FC, ReactElement, useEffect } from 'react'
import Phaser from 'phaser'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core'

import { gameConfig, StartScene, StartSceneKey } from '../../game/gameConfig'
import { MessageSystem } from '../../game/gameDataInterface'

type GameProps = {
    messageSystem: MessageSystem
}

const useStyles = makeStyles({
    root: {
        maxWidth: 1280,
        maxHeight: 720,
    },
})
export const SessionDisplay: FC<GameProps> = ({
    messageSystem,
}): ReactElement => {
    const classes = useStyles()

    useEffect(() => {
        const game = new Phaser.Game(gameConfig)

        // This is a workaround to pass data into the Scene
        // https://www.html5gamedevs.com/topic/38327-pass-custom-variable-into-phasergame/
        // https://www.html5gamedevs.com/topic/36148-phaser-3-scene-phaser-2-state-passing-data-to-init-when-start/
        game.scene.add(StartSceneKey, StartScene, false)
        game.scene.start(StartSceneKey, {
            messageSystem,
        })

        return () => {
            game?.destroy(true)
        }
    }, [])

    return <div id='game-root' className={classes.root} />
}

SessionDisplay.propTypes = {
    messageSystem: PropTypes.instanceOf(MessageSystem),
}
