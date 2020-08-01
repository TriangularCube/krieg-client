import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline } from '@material-ui/core'

import { NavBar } from './site/NavBar'
import { Game } from './site/Game'

const App: FC = (): ReactElement => {
    return (
        <>
            <CssBaseline />
            <NavBar />
            <Game />
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
