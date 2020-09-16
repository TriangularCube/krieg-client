import React, { FC, ReactElement, useRef } from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import { useLoginSelector } from '../util/redux/reduxReducers'
import { useAsyncCallback } from 'react-async-hook'

import { HTTPMethod, NetworkMessage, sendMessage } from '../util/network'

import {
    Button,
    CircularProgress,
    Container,
    Card,
    TextField,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface NewGameMessage extends NetworkMessage {
    content: {
        sessionId: number
    }
}

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    submit: {
        marginTop: theme.spacing(2),
    },
}))

export const CreateNewSession: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)

    const classes = useStyles()

    const sessionNameRef = useRef(null)

    const history = useHistory()
    const startGameAction = async () => {
        const result = (await sendMessage(
            HTTPMethod.POST,
            '/create-new-game',
            true,
            {
                sessionName: sessionNameRef.current.value,
            }
        )) as NewGameMessage

        history.push(`/game/${result.content.sessionId}`)
    }
    const asyncStart = useAsyncCallback(startGameAction)
    const handleStart = event => {
        event.preventDefault()
        asyncStart.execute()
    }

    if (!isLoggedIn) {
        return <Redirect to='/' />
    }

    return (
        <Container maxWidth='sm'>
            <Card className={classes.container}>
                <Typography variant='h4' color='primary'>
                    Create New Game
                </Typography>
                <form onSubmit={handleStart}>
                    <TextField
                        fullWidth
                        margin='normal'
                        label='Game Name'
                        name='game-name'
                        id='game-name'
                        inputRef={sessionNameRef}
                    />
                    <Button
                        className={classes.submit}
                        type='submit'
                        fullWidth
                        disabled={asyncStart.loading}
                    >
                        {asyncStart.loading ? (
                            <CircularProgress color='secondary' />
                        ) : (
                            'Start New Game'
                        )}
                    </Button>
                </form>
            </Card>
        </Container>
    )
}
