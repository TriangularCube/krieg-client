import React, { FC, ReactElement, useEffect } from 'react'

import { makeStyles, Tab, Tabs } from '@material-ui/core'
import {
    MapBuilderScene,
    MapBuilderSceneKey,
    mapConfig,
} from '../../phaser/mapBuilder/mapConfig'

export interface MapData {
    name: string
}
interface MapProps {
    mapData: MapData
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
})
export const EditMapDisplay: FC<MapProps> = ({
    mapData,
}: MapProps): ReactElement => {
    const classes = useStyles()

    const channel = new MessageChannel()
    const port = channel.port1

    port.onmessage = event => {
        console.log(event.data)
    }

    useEffect(() => {
        const display = new Phaser.Game(mapConfig)

        display.scene.add(MapBuilderSceneKey, MapBuilderScene, false)
        display.scene.start(MapBuilderSceneKey, {
            mapData,
            port: channel.port2,
        })

        return () => {
            display?.destroy(true)
        }
    }, [])

    return (
        <div className={classes.container}>
            <div id='map-root' className={classes.mapRoot} />
            <Tabs>
                <Tab label='Tools' />
                <Tab label='Data' />
            </Tabs>
        </div>
    )
}
