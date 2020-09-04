import React, { FC, ReactElement, useEffect, useReducer } from 'react'
import { HTTPMethod, sendMessage } from '../../util/network'
import { Typography } from '@material-ui/core'

export const MyGamesList: FC = (): ReactElement => {
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

    return <Typography>Loaded</Typography>
}
