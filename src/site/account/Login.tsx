import React, { FC, FormEvent, ReactElement, useRef } from 'react'
import { Link as RouterLink, Redirect, useLocation } from 'react-router-dom'
import { LocationState } from '../../util/LocationState'

import { useAsyncCallback } from 'react-async-hook'

// Redux
import { useDispatch } from 'react-redux'
import { useLoginSelector } from '../../util/redux/reduxReducers'
import { setLoginState } from '../../util/redux/actions'

// Networking
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'
import { setAuthorizationToken } from '../../util/authorization'

import {
    Avatar,
    Button,
    Card,
    CircularProgress as Progress,
    Container,
    Link,
    TextField,
    Typography,
} from '@material-ui/core'
import { LockOutlined } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

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

    const asyncLogin = useAsyncCallback(async () => {
        return await login(emailRef.current.value, passwordRef.current.value)
    })

    switch (asyncLogin.status) {
        case 'success':
            const res = asyncLogin.result
            if (res.success) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                setAuthorizationToken(res.content.accessToken as string)
                dispatch(setLoginState(true))

                const referrer = location.state?.referrer
                return <Redirect to={referrer ?? '/'} />
            } else {
                // TODO
                console.log(res.error)
            }
            break
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

const login = async (
    email: string,
    password: string
): Promise<NetworkMessage> => {
    let response: NetworkMessage
    try {
        return sendMessage(HTTPMethod.POST, '/login', false, {
            email,
            password,
        })
    } catch (err) {
        response = {
            success: false,
            error: err,
        }
    }

    return response
}
