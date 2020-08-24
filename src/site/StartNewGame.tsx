import React, { FC, ReactElement } from 'react'
import { Redirect } from 'react-router-dom'

import { useLoginSelector } from '../util/redux/reduxReducers'
import { useAsyncCallback } from 'react-async-hook'

import { HTTPMethod, sendMessage } from '../util/network'

import { Button, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
}))

export const StartNewGame: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)

    const classes = useStyles()

    const startGameAction = async () => {
        const result = await sendMessage(
            HTTPMethod.POST,
            '/create-new-game',
            true,
            {
                body: JSON.stringify({
                    test: 'yo?',
                }),
            }
        )

        console.log('Final Result', result)
    }
    const asyncStart = useAsyncCallback(startGameAction)
    const handleStart = () => {
        asyncStart.execute()
    }

    // if (!isLoggedIn) {
    //     return <Redirect to='/' />
    // }

    return (
        <div className={classes.container}>
            <Button
                variant='contained'
                color='primary'
                onClick={handleStart}
                disabled={asyncStart.loading}
            >
                {asyncStart.loading ? (
                    <CircularProgress color='secondary' />
                ) : (
                    'Start New Game'
                )}
            </Button>
        </div>
    )
}
