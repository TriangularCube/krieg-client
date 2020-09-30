import React, { FC, ReactElement, useEffect, useState } from 'react'

import { makeStyles, Tab, Tabs } from '@material-ui/core'
import {
    MapBuilderScene,
    MapBuilderSceneKey,
    mapConfig,
} from '../../krieg/mapBuilder/mapConfig'

import { KriegMap } from '../../krieg/common/GameMap'

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

    const onMessage = event => {
        console.log(event.data)
    }

    useEffect(() => {
        const channel = new MessageChannel()
        const port1 = channel.port1

        port1.onmessage = onMessage

        const display = new Phaser.Game(mapConfig)

        display.scene.add(MapBuilderSceneKey, MapBuilderScene, false)
        display.scene.start(MapBuilderSceneKey, {
            kriegMap,
            port: channel.port2,
        })

        return () => {
            display?.destroy(true)
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
