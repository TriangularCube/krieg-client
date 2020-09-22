import React, { FC, ReactElement } from 'react'
import { useLoginSelector } from '../../util/redux/reduxReducers'
import { Redirect, useParams } from 'react-router-dom'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { EditMapDisplay, MapData } from './EditMapDisplay'
import { useAsync } from 'react-async-hook'
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 30,
    },
})
export const EditMap: FC = (): ReactElement => {
    const isLoggedIn = useLoginSelector(state => state.isLoggedIn)
    const { mapId } = useParams()

    const classes = useStyles()

    if (!isLoggedIn) {
        console.log('Not logged in')
        return <Redirect to='/' />
    }

    if (!mapId) {
        console.log('No Map ID')
        return <Redirect to='/' />
    }

    return (
        <Container className={classes.container}>
            <EditMapGet />
        </Container>
    )
}

interface MapMessage extends NetworkMessage {
    content: {
        map: MapData
    }
}
const EditMapGet: FC = (): ReactElement => {
    const { mapId } = useParams()
    const getResult = useAsync(async () => {
        return await sendMessage(HTTPMethod.GET, `/map/${mapId}`, true)
    }, [])

    switch (getResult.status) {
        case 'loading':
            return <CircularProgress />
        case 'success':
            const mapResult = getResult.result as MapMessage
            if (!mapResult.content?.map) {
                // TODO
                return null
            }

            return <EditMapDisplay mapData={mapResult.content.map} />
    }

    return <CircularProgress />
}
