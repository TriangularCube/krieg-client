import React, { FC, ReactElement, useState } from 'react'
import { getTargetName, setTarget as setTargetInApp } from '../util/apiTarget'
import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}))

export const TargetSelection: FC = (): ReactElement => {
    const classes = useStyles()

    const [target, setTarget] = useState(getTargetName())
    const [selectedTarget, setSelectedTarget] = useState(target)

    const handleChange = event => {
        setSelectedTarget(event.target.value)
    }

    const handleSubmit = event => {
        event.preventDefault()

        if (setTargetInApp(selectedTarget)) {
            setTarget(selectedTarget)
        } else {
            // TODO: Display error
        }
    }

    return (
        <Container maxWidth='xs'>
            <div className={classes.container}>
                <Typography variant='h5'>
                    Current target is: {target}
                </Typography>

                <br />

                <form onSubmit={handleSubmit}>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend'>API Target</FormLabel>

                        <RadioGroup
                            value={selectedTarget}
                            onChange={handleChange}
                        >
                            <FormControlLabel
                                value='local'
                                control={<Radio />}
                                label='Local'
                            />
                            <FormControlLabel
                                value='dev'
                                control={<Radio />}
                                label='Development'
                            />
                            <FormControlLabel
                                value='staging'
                                control={<Radio />}
                                label='Staging'
                            />
                            <FormControlLabel
                                value='production'
                                control={<Radio />}
                                label='Production'
                            />
                        </RadioGroup>

                        <br />

                        <Button
                            variant='contained'
                            disabled={target === selectedTarget}
                            type='submit'
                            color='primary'
                        >
                            Submit!
                        </Button>
                    </FormControl>
                </form>
            </div>
        </Container>
    )
}
