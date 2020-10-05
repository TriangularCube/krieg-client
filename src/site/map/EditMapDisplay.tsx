import React, { FC, ReactElement, useEffect, useState } from 'react'

import { makeStyles, Tab, Tabs } from '@material-ui/core'

import { KriegMap } from '../../krieg/common/GameMap'
import { mapConfig } from '../../krieg/mapBuilder/mapConfig'
import {
    MapBuilderScene,
    MapBuilderSceneKey,
} from '../../krieg/mapBuilder/MapBuilderScene'
import { LoadingScene, LoadingSceneKey } from '../../krieg/common/LoadingScene'

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

    const [tabState, setTabState] = useState(0)

    const onMessage = (event: MessageEvent) => {
        console.log(event.data)
    }

    useEffect(() => {
        const channel = new MessageChannel()
        const port1 = channel.port1

        port1.onmessage = onMessage

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
                <Tabs
                    value={tabState}
                    onChange={(evt, val) => setTabState(val)}
                >
                    <Tab label='Tools' />
                    <Tab label='Data' />
                </Tabs>
            </div>
        </div>
    )
}
