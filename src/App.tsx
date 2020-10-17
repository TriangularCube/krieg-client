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
import { makeStyles } from '@material-ui/core/styles'

import loadable from '@loadable/component'

import { NavBar } from './site/NavBar'
import { Footer } from './site/Footer'

// region Dynamic Imports
const Splash = loadable(
    () => import(/* webpackChunkName: "Splash" */ './site/Splash'),
    {
        resolveComponent: components => components.Splash,
    }
)
const SessionPage = loadable(
    () =>
        import(
            /* webpackChunkName: "SessionPage" */ './site/session/SessionPage'
        ),
    {
        resolveComponent: components => components.SessionPage,
    }
)
const CreateAccount = loadable(
    () =>
        import(
            /* webpackChunkName: "CreateAccount" */ './site/account/CreateAccount'
        ),
    {
        resolveComponent: components => components.CreateAccount,
    }
)
const NotFound = loadable(
    () => import(/* webpackChunkName: "NotFound" */ './site/NotFound'),
    {
        resolveComponent: components => components.NotFound,
    }
)
const TargetSelection = loadable(
    () =>
        import(
            /* webpackChunkName: "TargetSelection" */ './site/TargetSelection'
        ),
    {
        resolveComponent: components => components.TargetSelection,
    }
)
const Login = loadable(
    () => import(/* webpackChunkName: "Login" */ './site/account/Login'),
    {
        resolveComponent: components => components.Login,
    }
)
const VerifyAccount = loadable(
    () =>
        import(
            /* webpackChunkName: "VerifyAccount" */ './site/account/VerifyAccount'
        ),
    {
        resolveComponent: components => components.VerifyAccount,
    }
)
const LogOut = loadable(
    () => import(/* webpackChunkName: "LogOut" */ './site/account/LogOut'),
    {
        resolveComponent: components => components.LogOut,
    }
)
const CreateSession = loadable(
    () =>
        import(
            /* webpackChunkName: "CreateSession" */ './site/user/CreateSession'
        ),
    {
        resolveComponent: components => components.CreateSession,
    }
)
const MySessionsList = loadable(
    () =>
        import(
            /* webpackChunkName: "MySessionsList" */ './site/user/MySessionsList'
        ),
    {
        resolveComponent: components => components.MySessionsList,
    }
)
const MyMapsList = loadable(
    () => import(/* webpackChunkName: "MyMapsList" */ './site/user/MyMapsList'),
    {
        resolveComponent: components => components.MyMapsList,
    }
)
const EditMap = loadable(
    () => import(/* webpackChunkName: "EditMap" */ './site/map/EditMap'),
    {
        resolveComponent: components => components.EditMap,
    }
)
// endregion

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
                        <Route path='/map-edit/:mapId'>
                            <EditMap />
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
