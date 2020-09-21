import React, { FC, ReactElement } from 'react'
import { Typography } from '@material-ui/core'

export const Splash: FC = (): ReactElement => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
                marginTop: 20,
            }}
        >
            <Typography align='center'>Project Krieg</Typography>
            <br />

            <Typography align='center'>
                This website is only designed for large screens at this time,
                and as such may be unable to display certain pages if attempting
                to view them at smaller than supported resolutions.
            </Typography>
        </div>
    )
}
