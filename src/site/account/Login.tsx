import React, { FC, FormEvent, ReactElement, useRef } from 'react'
import { Link as RouterLink, Redirect, useLocation } from 'react-router-dom'
import { LocationState } from '../../util/LocationState'

import { useDispatch } from 'react-redux'
import { useLoginSelector } from '../../util/redux/reduxReducers'
import { setLoginState } from '../../util/redux/actions'

import { useAsyncCallback } from 'react-async-hook'

import {
    Avatar,
    Button,
    Card,
    Container,
    TextField,
    Typography,
    Link,
    CircularProgress as Progress,
} from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { login } from '../../util/network'
import { setAuthorizationToken } from '../../util/authorization'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 1),
        height: 50, // This should be the height of the Progress Indicator
    },
    linkSection: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    spacer: {
        flex: 1,
    },
}))

export const Login: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)
    const dispatch = useDispatch()
    const location = useLocation<LocationState>()

    const classes = useStyles()

    // Refs for inputs
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault()
        asyncLogin.execute()
    }
    const loginAction = async () => {
        const res = await login(
            emailRef.current.value,
            passwordRef.current.value
        )

        if (res.success) {
            setAuthorizationToken(res.content.accessToken as string)
            dispatch(setLoginState(true))
        } else {
            // TODO: error
            console.log(res.error)
        }
    }
    const asyncLogin = useAsyncCallback(loginAction)

    if (isLoggedIn) {
        const referrer = location.state?.referrer
        return <Redirect to={referrer ?? '/'} />
    }

    return (
        <Container maxWidth='sm'>
            <Card className={classes.container}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        label='Email Address'
                        type='email'
                        name='email'
                        id='email'
                        inputRef={emailRef}
                    />
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        id='password1'
                        name='password1'
                        label='Password'
                        type='password'
                        inputRef={passwordRef}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        className={classes.submit}
                        disabled={asyncLogin.loading}
                    >
                        {asyncLogin.loading ? <Progress /> : 'Login'}
                    </Button>
                </form>

                <div className={classes.linkSection}>
                    <Link
                        variant='body2'
                        component={RouterLink}
                        to='/forgot-password'
                    >
                        Forgot password?
                    </Link>

                    <div className={classes.spacer} />

                    <Link
                        variant='body2'
                        component={RouterLink}
                        to='/create-account'
                    >
                        Create a new account
                    </Link>
                </div>
            </Card>
        </Container>
    )
}
