import React, { FC, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './util/redux/reduxStore'

import { CssBaseline } from '@material-ui/core'
import { NavBar } from './site/NavBar'
import { Splash } from './site/Splash'
import { SessionPage } from './site/session/SessionPage'
import { CreateAccount } from './site/account/CreateAccount'
import { NotFound } from './site/NotFound'
import { TargetSelection } from './site/TargetSelection'
import { Login } from './site/account/Login'
import { VerifyAccount } from './site/account/VerifyAccount'
import { LogOut } from './site/account/LogOut'
import { CreateSession } from './site/user/CreateSession'
import { MySessionsList } from './site/user/MySessionsList'
import { MyMapsList } from './site/user/MyMapsList'
import { makeStyles } from '@material-ui/core/styles'
import { Footer } from './site/Footer'

const useStyles = makeStyles({
    siteContent: {
        flex: '1 0 auto',
        margin: 8,
        marginBottom: 32,
    },
})

const App: FC = (): ReactElement => {
    const classes = useStyles()

    return (
        <Provider store={store}>
            <CssBaseline />

            <Router>
                <NavBar />

                <main className={classes.siteContent}>
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

                        <Route path='/my-maps-list'>
                            <MyMapsList />
                        </Route>

                        <Route path='/create-session'>
                            <CreateSession />
                        </Route>
                        <Route path='/session/:sessionId'>
                            <SessionPage />
                        </Route>
                        <Route path='/my-sessions-list'>
                            <MySessionsList />
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
                </main>
                <Footer />
            </Router>
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
