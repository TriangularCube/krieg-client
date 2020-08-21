import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './util/redux/reduxStore'

import { CssBaseline } from '@material-ui/core'
import { NavBar } from './site/NavBar'
import { Splash } from './site/Splash'
import { Game } from './site/Game'
import { CreateAccount } from './site/account/CreateAccount'
import { NotFound } from './site/NotFound'
import { TargetSelection } from './site/TargetSelection'
import { Login } from './site/account/Login'
import { VerifyAccount } from './site/account/VerifyAccount'
import { LogOut } from './site/account/LogOut'

const App: FC = (): ReactElement => {
    return (
        <Provider store={store}>
            <CssBaseline />

            <Router>
                <NavBar />

                <Switch>
                    <Route exact path='/create-account'>
                        <CreateAccount />
                    </Route>
                    <Route exact path='/login'>
                        <Login />
                    </Route>
                    <Route exact path='/logout'>
                        <LogOut />
                    </Route>
                    <Route exact path='/verify-account'>
                        <VerifyAccount />
                    </Route>

                    <Route path='/game'>
                        <Game />
                    </Route>

                    <Route path='/target-select'>
                        <TargetSelection />
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
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
