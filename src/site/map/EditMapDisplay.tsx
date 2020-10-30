import React, { FC, ReactElement, useEffect, useState } from 'react'

import { Grid, makeStyles, Tab, Tabs } from '@material-ui/core'
import Spritesheet from 'react-responsive-spritesheet'

import { KriegMap } from '../../krieg/common/GameMap'
import { mapConfig } from '../../krieg/mapBuilder/mapConfig'
import {
    MapBuilderScene,
    MapBuilderSceneKey,
} from '../../krieg/mapBuilder/MapBuilderScene'
import {
    MessageType,
    ToolCategory,
    ToolType,
} from '../../util/SceneMessages/MessageTypes'
import { LoadingScene, LoadingSceneKey } from '../../krieg/common/LoadingScene'
import { SelectionCursorPadding } from '../../krieg/common/GraphicsData'
import { SceneMessageHandler } from '../../util/SceneMessages/SceneMessageHandler'

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
    const [handler, setHandler] = useState<SceneMessageHandler | null>(null)
    const [currentTool, setTool] = useState<ToolType | null>(null)

    const handleToolSelection = (tool: ToolType) => {
        setTool(tool)
        handler?.postMessage(MessageType.Tool, tool)
    }

    useEffect(() => {
        const channel = new MessageChannel()
        const handler = new SceneMessageHandler(channel.port1)
        setHandler(handler)

        handler.addListener(MessageType.Tool, data => {
            console.log(data)
        })

        handler.addListener(MessageType.System, data => console.log(data))

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
                            currentTool={currentTool}
                            toolData={{
                                category: ToolCategory.Terrain,
                                type: 0,
                            }}
                            handler={handleToolSelection}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_02.png'
                            currentTool={currentTool}
                            toolData={{
                                category: ToolCategory.Terrain,
                                type: 1,
                            }}
                            handler={handleToolSelection}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_03.png'
                            currentTool={currentTool}
                            toolData={{
                                category: ToolCategory.Terrain,
                                type: 2,
                            }}
                            handler={handleToolSelection}
                        />
                        <Tool
                            image='/assets/graphics/terrain/scifiTile_04.png'
                            currentTool={currentTool}
                            toolData={{
                                category: ToolCategory.Terrain,
                                type: 3,
                            }}
                            handler={handleToolSelection}
                        />
                    </Grid>
                </div>
            </div>
        </div>
    )
}

interface ToolProps {
    image: string
    toolData: ToolType
    currentTool: ToolType | null
    handler: (tool: ToolType) => void
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
const Tool: FC<ToolProps> = ({
    image,
    toolData,
    currentTool,
    handler,
}: ToolProps) => {
    const classes = useToolStyles()
    const isCurrentTool =
        currentTool?.category === toolData.category &&
        currentTool?.type === toolData.type

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
                    onClick={() => handler(toolData)}
                />
                <div className={classes.toolOverlay} hidden={!isCurrentTool}>
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
