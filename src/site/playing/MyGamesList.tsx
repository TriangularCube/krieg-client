import React, { FC, ReactElement, useEffect, useReducer } from 'react'
import { Container, Typography } from '@material-ui/core'

import { HTTPMethod, sendMessage } from '../../util/network'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}))
export const MyGamesList: FC = (): ReactElement => {
    const classes = useStyles()
    const [state, setState] = useReducer(
        (state, newState) => {
            return newState
        },
        { isLoading: false }
    )

    useEffect(() => {
        // TODO
        const asyncGet = async () => {
            const result = await sendMessage(
                HTTPMethod.GET,
                '/my-games-list',
                true
            )

            console.log(result)
        }

        asyncGet()
    }, [])

    if (state.isLoading) {
        return <Typography>Loading</Typography>
    }

    return (
        <Container className={classes.container}>
            <Typography>Loaded</Typography>
        </Container>
    )
}
