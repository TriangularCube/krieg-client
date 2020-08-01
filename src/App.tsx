import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'
import { NavBar } from './site/NavBar'
import { Splash } from './site/Splash'
import { Game } from './site/Game'

const App: FC = (): ReactElement => {
    return (
        <>
            <CssBaseline />

            <Router>
                <NavBar />

                <Switch>
                    <Route path='/game'>
                        <Game />
                    </Route>
                    <Route path='/'>
                        <Splash />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
