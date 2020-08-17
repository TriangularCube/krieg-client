import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import { CssBaseline } from '@material-ui/core'
import { NavBar } from './site/NavBar'
import { Splash } from './site/Splash'
import { Game } from './site/Game'
import { CreateAccount } from './site/CreateAccount'
import { NotFound } from './NotFound'

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
                    <Route path='/create-account'>
                        <CreateAccount />
                    </Route>
                    <Route exact path='/'>
                        <Splash />
                    </Route>
                    <Route path='/404'>
                        <NotFound />
                    </Route>

                    {/* Redirect in case of bad address */}
                    <Redirect to='/404' />
                </Switch>
            </Router>
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
