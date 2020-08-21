import React, { FC, ReactElement, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoginState } from '../../util/redux/actions'
import { useLoginSelector } from '../../util/redux/reduxReducers'
import { CircularProgress, Container, Typography } from '@material-ui/core'

export const LogOut: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setLoginState(false))
    }, [])

    return (
        <Container maxWidth='xs'>
            {isLoggedIn ? (
                <CircularProgress />
            ) : (
                <Typography variant='body1'>
                    You have been logged out
                </Typography>
            )}
        </Container>
    )
}
