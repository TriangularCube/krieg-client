import React, { FC, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useLoginSelector } from '../util/redux/reduxReducers'

import {
    makeStyles,
    AppBar,
    ButtonBase,
    Toolbar,
    Typography,
    IconButton,
    Hidden,
    Button,
    Menu,
    MenuItem,
    ListItemText,
} from '@material-ui/core'
import { Filter, AccountCircle } from '@material-ui/icons'
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks'

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    spacer: {
        flex: 1,
    },
    menuItemText: {
        flex: 1,
        flexDirection: 'row',
        textAlign: 'right',
    },
}))

export const NavBar: FC = (): ReactElement => {
    const classes = useStyles()
    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'userMenu',
    })

    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)

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

                <Button color='inherit' component={Link} to='/create-new-game'>
                    Create Game
                </Button>

                <Button
                    color='inherit'
                    component={Link}
                    to='/session/276779940475568653'
                >
                    {/* TODO */}
                    Game
                </Button>

                <Button color='inherit' component={Link} to='/my-games-list'>
                    Games List
                </Button>

                <Button color='inherit' component={Link} to='/about'>
                    About
                </Button>
                {/* User button */}
                <div>
                    <IconButton color='inherit' {...bindTrigger(popupState)}>
                        <AccountCircle />
                    </IconButton>
                    <Menu {...bindMenu(popupState)}>
                        {!isLoggedIn && (
                            <MenuItem
                                onClick={popupState.close}
                                component={Link}
                                to='/login'
                            >
                                <ListItemText
                                    className={classes.menuItemText}
                                    primary='Login'
                                />
                            </MenuItem>
                        )}

                        <MenuItem
                            onClick={popupState.close}
                            component={Link}
                            to='/target-select'
                        >
                            <ListItemText primary='Target Selection' />
                        </MenuItem>

                        {isLoggedIn && (
                            // TODO: Logout could probably be handled here
                            <MenuItem
                                onClick={popupState.close}
                                component={Link}
                                to='/logout'
                            >
                                <ListItemText
                                    className={classes.menuItemText}
                                    primary='Logout'
                                />
                            </MenuItem>
                        )}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
}
