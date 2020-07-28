import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'

import * as Phaser from 'phaser'
import { gameConfig } from './game/gameConfig'

const App: FC = (): ReactElement => {
    new Phaser.Game(gameConfig)
    return (
        <>
            <div style={{ textAlign: 'center' }}>This is React</div>
            <div id='game-root' />
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
