import React, { FC, ReactElement } from 'react'
import { Link } from 'react-router-dom'

import {
    makeStyles,
    AppBar,
    ButtonBase,
    Toolbar,
    Typography,
    IconButton,
    Hidden,
    Button,
} from '@material-ui/core'
import { Filter } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    spacer: {
        flex: 1,
    },
}))

export const NavBar: FC = (): ReactElement => {
    const classes = useStyles()

    return (
        <AppBar position='sticky'>
            <Toolbar>
                <IconButton
                    color='inherit'
                    className={classes.menuButton}
                    component={Link}
                    to={'/'}
                >
                    <Filter />
                </IconButton>

                <Hidden xsDown>
                    <ButtonBase component={Link} to={'/'}>
                        <Typography color='inherit' variant='h6'>
                            Project Krieg
                        </Typography>
                    </ButtonBase>
                </Hidden>

                <div className={classes.spacer} />

                <Button color='inherit' component={Link} to={'/game'}>
                    Game
                </Button>

                <Button color='inherit' component={Link} to={'/about'}>
                    About
                </Button>
            </Toolbar>
        </AppBar>
    )
}
