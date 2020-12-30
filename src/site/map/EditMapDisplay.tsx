import React, { FC, ReactElement, useEffect, useState } from 'react'

import { CircularProgress, makeStyles, Tab, Tabs } from '@material-ui/core'

import { KriegMap } from '../../krieg/common/GameMap'
import { mapConfig } from '../../krieg/mapBuilder/mapConfig'
import {
  MapBuilderScene,
  MapBuilderSceneKey,
} from '../../krieg/mapBuilder/MapBuilderScene'
import {
  MessageType,
  Owner,
  ToolType,
} from '../../util/SceneMessages/MessageTypes'
import { LoadingScene, LoadingSceneKey } from '../../krieg/common/LoadingScene'
import { SceneMessageHandler } from '../../util/SceneMessages/SceneMessageHandler'
import { MapTools } from './MapTools'

enum TabState {
  Tools,
  Data,
}

interface MapProps {
  kriegMap: KriegMap
}
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  mapRoot: {
    paddingTop: 10,
    marginRight: 10,
    maxWidth: 1280,
    maxHeight: 720,
  },
  sideBar: {
    maxHeight: 600,
    display: 'flex',
    flexDirection: 'column',
  },
})
export const EditMapDisplay: FC<MapProps> = ({
  kriegMap,
}: MapProps): ReactElement => {
  const classes = useStyles()

  const [tabState, setTabState] = useState<TabState>(TabState.Tools)
  const [handler, setHandler] = useState<SceneMessageHandler | null>(null)

  // Start Engine
  useEffect(() => {
    const channel = new MessageChannel()
    const handler = new SceneMessageHandler(channel.port1)
    setHandler(handler)

    handler.addListener(MessageType.System, data => console.log(data)) // TODO

    const engine = new Phaser.Game(mapConfig)

    engine.scene.add(LoadingSceneKey, LoadingScene, false)
    engine.scene.add(MapBuilderSceneKey, MapBuilderScene, false)
    engine.scene.start(LoadingSceneKey, {
      nextSceneKey: MapBuilderSceneKey,
      nextSceneData: {
        kriegMap,
        port: channel.port2,
      },
    })

    return () => {
      engine?.destroy(true)
    }
  }, [])

  return (
    <div className={classes.container}>
      <div id='map-root' className={classes.mapRoot} />
      <div>
        <Tabs value={tabState} onChange={(evt, val) => setTabState(val)}>
          <Tab label='Tools' />
          <Tab label='Data' />
        </Tabs>
        <div hidden={tabState !== TabState.Tools}>
          {handler ? <MapTools handler={handler} /> : <CircularProgress />}
        </div>
        <div hidden={tabState !== TabState.Data}>{/* TODO */}</div>
      </div>
    </div>
  )
}
