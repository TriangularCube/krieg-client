import React, { FC, ReactElement } from 'react'
import { AppBar, ButtonBase, Toolbar, Typography } from '@material-ui/core'

export const NavBar: FC = (): ReactElement => {
    return (
        <AppBar position='sticky'>
            <Toolbar>
                <ButtonBase>
                    <Typography>Hi</Typography>
                </ButtonBase>
            </Toolbar>
        </AppBar>
    )
}
