import React, { FC, ReactElement, useRef, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { useAsyncCallback } from 'react-async-hook'

// Redux
import { useDispatch } from 'react-redux'
import { setLoginState } from '../../util/redux/actions'
import { useLoginSelector } from '../../util/redux/reduxReducers'

// Networking
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'
import { getTargetUrl } from '../../util/apiTarget'
import { setAuthorizationToken } from '../../util/authorization'

import {
    Avatar,
    Button,
    Card,
    Container,
    TextField,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Person } from '@material-ui/icons'

enum SubmitError {
    passwordMatch,
}

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
}))

export const CreateAccount: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)

    const classes = useStyles()

    // region Form Submit
    const [submitError, setSubmitError] = useState(null)

    const dispatch = useDispatch()

    const displayNameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordRef2 = useRef(null)

    const handleSubmit = event => {
        event.preventDefault()

        // TODO: Deal with registration restrictions

        asyncRegister.execute()
    }
    const registerAction = async () => {
        const res = await registerUser(
            displayNameRef.current.value,
            emailRef.current.value,
            passwordRef.current.value,
            passwordRef2.current.value
        )

        if (res.success) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setAuthorizationToken(res.content.accessToken as string)
            dispatch(setLoginState(true))
            // history.push('/verify-account')
        } else {
            console.error(res)
        }
    }
    const asyncRegister = useAsyncCallback(registerAction)
    // endregion

    if (isLoggedIn) {
        return <Redirect to='/' />
    }

    return (
        <Container maxWidth='sm'>
            <Card className={classes.container}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Create Account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        label='Display Name'
                        name='display-name'
                        id='display-name'
                        inputRef={displayNameRef}
                    />
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
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        id='password2'
                        name='password2'
                        label='Re-enter Password'
                        type='password'
                        inputRef={passwordRef2}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        // variant='contained'
                        className={classes.submit}
                        // onClick={asyncLogin.execute}
                        // disabled={asyncLogin.loading}
                    >
                        Create
                    </Button>
                </form>
            </Card>
        </Container>
    )
}

const registerUser = async (
    displayName: string,
    email: string,
    password1: string,
    password2: string
): Promise<NetworkMessage> => {
    try {
        return await sendMessage(
            HTTPMethod.POST,
            getTargetUrl() + '/register',
            {
                displayName,
                email,
                password1,
                password2,
            }
        )
    } catch (err) {
        return {
            success: false,
            error: err,
        }
    }
}
