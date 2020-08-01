import React, { FC, ReactElement } from 'react'
import { Typography } from '@material-ui/core'

export const Splash: FC = (): ReactElement => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
            }}
        >
            <Typography align='center'>Project Krieg</Typography>
        </div>
    )
}
