import React, { FC, ReactElement } from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { Container, Hidden, makeStyles, Typography } from '@material-ui/core'

import { useLoginSelector } from '../../util/redux/reduxReducers'
import { GameConnection } from './GameConnection'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 30,
    },
})
export const GamePage: FC = (): ReactElement => {
    const classes = useStyles()
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)
    const { gameId } = useParams()

    if (!isLoggedIn) {
        console.log('Not logged in')
        return <Redirect to='/' />
    }

    if (!gameId) {
        console.log('No Game ID')
        return <Redirect to='/' />
    }

    return (
        <Container className={classes.container}>
            {/* TODO This isn't good enough for dealing with iPad resolution */}

            <Hidden smDown implementation='js'>
                {/* Make sure this uses JS implementation to deactivate game properly */}
                <GameConnection />

                <div style={{ marginTop: 10 }}>
                    <Typography>Controller stuff?</Typography>
                </div>
            </Hidden>

            <Hidden mdUp>
                <Typography align='center'>
                    This page cannot be displayed on a small screen. We may
                    implement this in the future.
                </Typography>
            </Hidden>
        </Container>
    )
}
