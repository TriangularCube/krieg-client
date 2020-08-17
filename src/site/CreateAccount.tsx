import React, { FC, ReactElement, useRef } from 'react'

import {
    Avatar,
    Container,
    Typography,
    Card,
    TextField,
    Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Person } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        marginBottom: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 1),
        height: 50, // This should be the height of the Progress Indicator
    },
}))

export const CreateAccount: FC = (): ReactElement => {
    const classes = useStyles()

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const handleSubmit = event => {
        event.preventDefault()
    }

    return (
        <Container maxWidth='sm'>
            <Card className={classes.container}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Create Account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        label='Email Address'
                        type='email'
                        name='email'
                        id='email'
                        inputRef={emailRef}
                        variant='filled'
                    />
                    <TextField
                        fullWidth={true}
                        margin='normal'
                        label='Password'
                        type='password'
                        inputRef={passwordRef}
                        variant='filled'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        // variant='contained'
                        className={classes.submit}
                        // onClick={asyncLogin.execute}
                        // disabled={asyncLogin.loading}
                    >
                        Create
                    </Button>
                </form>
            </Card>
        </Container>
    )
}
