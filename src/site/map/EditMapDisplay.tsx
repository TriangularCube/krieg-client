import React, { FC, ReactElement, useEffect, useState } from 'react'

import { Grid, makeStyles, Tab, Tabs } from '@material-ui/core'
import Spritesheet from 'react-responsive-spritesheet'

import { KriegMap } from '../../krieg/common/GameMap'
import { mapConfig } from '../../krieg/mapBuilder/mapConfig'
import {
    MapBuilderScene,
    MapBuilderSceneKey,
} from '../../krieg/mapBuilder/MapBuilderScene'
import { LoadingScene, LoadingSceneKey } from '../../krieg/common/LoadingScene'
import { SelectionCursorPadding } from '../../krieg/common/GraphicsData'

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
    const [port, setPort] = useState<MessagePort | null>(null)

    const onMessage = (event: MessageEvent) => {
        console.log(event.data)
    }

    useEffect(() => {
        const channel = new MessageChannel()
        const port1 = channel.port1
        setPort(port1)

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
                <div hidden={tabState !== 0}>
                    {/* Terrain Grid */}
                    <Grid container>
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_01.png'
                            onClick={() => port?.postMessage('Set to Option 1')}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_02.png'
                            onClick={() => console.log('hi 2')}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_03.png'
                            onClick={() => console.log('hi 3')}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_04.png'
                            onClick={() => console.log('hi 4')}
                        />
                    </Grid>
                </div>
            </div>
        </div>
    )
}

interface ToolProps {
    image: string
    onClick: (event: Event) => void
}
const useToolStyles = makeStyles({
    toolBlockContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
    },
    toolBlock: {
        padding: `${SelectionCursorPadding}px`,
    },
    toolOverlay: {
        position: 'absolute',
        top: '0%',
        left: '50%',
        transform: 'translate(-50%, 0%)',
        pointerEvents: 'none',
    },
})
const Tool: FC<ToolProps> = ({ image, onClick }: ToolProps) => {
    const classes = useToolStyles()
    return (
        <Grid item xs={3}>
            <div className={classes.toolBlockContainer}>
                <Spritesheet
                    className={classes.toolBlock}
                    image={image}
                    widthFrame={64}
                    heightFrame={64}
                    steps={1}
                    fps={0}
                    isResponsive={false} // TODO: Wrap in proper div
                    onClick={onClick}
                />
                <div className={classes.toolOverlay}>
                    <img
                        style={{
                            pointerEvents: 'none',
                        }}
                        src='/assets/graphics/cursor.png'
                    />
                </div>
            </div>
        </Grid>
    )
}
