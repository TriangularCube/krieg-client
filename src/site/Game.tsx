import React, { FC, ReactElement } from 'react'

import * as Phaser from 'phaser'
import { gameConfig } from '../game/gameConfig'

export const Game: FC = (): ReactElement => {
    new Phaser.Game(gameConfig)
    return (
        <>
            <div style={{ textAlign: 'center' }}>This is React</div>
            <div id='game-root' />
        </>
    )
}
