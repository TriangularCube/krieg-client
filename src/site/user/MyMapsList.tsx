import React, { FC, ReactElement, useRef, useState } from 'react'
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { HTTPMethod, sendMessage } from '../../util/network'
import { useAsync, useAsyncCallback } from 'react-async-hook'
import { Redirect } from 'react-router'

const useStyles = makeStyles(theme => ({
    title: {
        margin: theme.spacing(2),
    },
    containerGrid: {
        padding: theme.spacing(2),
        backgroundColor: '#ee671d',
    },
    dialogActions: { paddingLeft: 15, paddingRight: 15 },
}))

export const MyMapsList: FC = (): ReactElement => {
    const classes = useStyles()

    const [displayDialog, setDisplayDialog] = useState(false)

    const listResult = useAsync(async () => {
        return await sendMessage(HTTPMethod.GET, '/my-maps-list', true)
    }, [])

    // region Dialog
    const newMapNameRef = useRef(null)
    const asyncCreate = useAsyncCallback(async () => {
        return await sendMessage(HTTPMethod.POST, '/create-new-map', true, {
            mapName: newMapNameRef.current.value,
        })
    })

    const handleOpenDialog = () => {
        setDisplayDialog(true)
    }
    const handleCancelDialog = () => {
        setDisplayDialog(false)
    }
    // endregion

    if (listResult.loading) {
        // TODO
        return <CircularProgress />
    }

    switch (asyncCreate.status) {
        case 'success':
            const res = asyncCreate.result
            if (res.success) {
                // TODO
                console.log(res.content)
                return <Redirect to='/' />
            } else {
                console.log(res)
            }
            break
    }

    return (
        <Container maxWidth='md'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant='h3' className={classes.title}>
                    My Maps
                </Typography>

                {/* Spacer */}
                <div style={{ flex: 1 }} />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Button onClick={handleOpenDialog}>New Map</Button>
                </div>
            </div>
            <Dialog
                open={displayDialog}
                onClose={handleCancelDialog}
                maxWidth='sm'
                fullWidth
            >
                <DialogTitle>Create New Map</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label='Map Name'
                        fullWidth
                        inputRef={newMapNameRef}
                    />
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={handleCancelDialog} color='secondary'>
                        Cancel
                    </Button>

                    {/* Spacing */}
                    <div style={{ flex: 1 }} />

                    <Button
                        onClick={() => asyncCreate.execute()}
                        disabled={asyncCreate.loading}
                        color='primary'
                    >
                        {asyncCreate.loading ? <CircularProgress /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={3} className={classes.containerGrid}>
                <MapCard />
                <MapCard />
                <MapCard />
                <MapCard />
                <MapCard />
            </Grid>
        </Container>
    )
}

const MapCard: FC = (): ReactElement => {
    return (
        <Grid item xs={12} sm={6}>
            <Card>
                <CardMedia
                    image={`http://placekitten.com/400/200`}
                    style={{ height: 0, paddingTop: '56.25%' }}
                />
                <CardContent>
                    <Typography>Hi</Typography>
                    <Typography color='textSecondary'>Second Line</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
