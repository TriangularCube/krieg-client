import React, { FC, ReactElement } from 'react'
import { useLoginSelector } from '../../util/redux/reduxReducers'
import { Redirect, useParams } from 'react-router-dom'
import { CircularProgress, Container, makeStyles } from '@material-ui/core'
import { EditMapDisplay } from './EditMapDisplay'
import { useAsync } from 'react-async-hook'
import { HTTPMethod, NetworkMessage, sendMessage } from '../../util/network'
import { KriegMap, KriegMapData } from '../../krieg/common/GameMap'

interface ParamTypes {
  mapId: string
}

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
  const { mapId } = useParams<ParamTypes>()

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
    map: KriegMapData
  }
}
const EditMapGet: FC = (): React.ReactElement | null => {
  const { mapId } = useParams<ParamTypes>()
  const getResult = useAsync(async () => {
    return await sendMessage(HTTPMethod.GET, `/map/${mapId}`, true)
  }, [])

  switch (getResult.status) {
    case 'loading':
      return <CircularProgress />
    case 'success':
      const mapResult = getResult.result as MapMessage
      if (!mapResult.success) {
        // TODO
        return null
      }

      return <EditMapDisplay kriegMap={new KriegMap(mapResult.content.map)} />
  }

  return <CircularProgress />
}
