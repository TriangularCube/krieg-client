import React, { FC, ReactElement } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    footer: {
        padding: theme.spacing(1),
        justifySelf: 'flex-end',
        backgroundColor: theme.palette.primary.light,
    },
}))

export const Footer: FC = (): ReactElement => {
    const classes = useStyles()

    return (
        <footer className={classes.footer}>
            <Typography variant='body1' color='inherit'>
                This is a footer
            </Typography>
        </footer>
    )
}
