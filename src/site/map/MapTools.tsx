import React, { FC, ReactElement, useEffect, useState } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import {
  MessageType,
  Owner,
  ToolCategory,
  ToolType,
} from '../../util/SceneMessages/MessageTypes'
import { PlacementTool } from './PlacementTool'
import Spritesheet from 'react-responsive-spritesheet'
import { SceneMessageHandler } from '../../util/SceneMessages/SceneMessageHandler'

interface MapToolsProps {
  // currentTool: ToolType | null
  // currentOwner: Owner
  // toolSelect: (tool: ToolType) => void
  // setOwner: (owner: Owner) => void
  handler: SceneMessageHandler
}
export const MapTools: FC<MapToolsProps> = ({
  handler,
}: MapToolsProps): ReactElement => {
  const [currentTool, setTool] = useState<ToolType | null>(null)
  const [currentOwner, setOwner] = useState<Owner>(Owner.One)

  const changeTool = (tool: ToolType) => {
    setTool(tool)
  }

  const handleToolSelection = (tool: ToolType) => {
    changeTool(tool)
    handler.postMessage(MessageType.Tool, tool)
  }

  useEffect(() => {
    handler.addListener(MessageType.Tool, data => changeTool(data as ToolType)) // TODO

    return () => {
      handler.off(MessageType.Tool, changeTool)
    }
  }, [])

  return (
    <>
      {/* Terrain Grid */}
      <Typography variant='body2'>Terrain</Typography>
      <Grid container>
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_01.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Terrain,
            type: 0,
          }}
          handler={handleToolSelection}
        />
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_02.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Terrain,
            type: 1,
          }}
          handler={handleToolSelection}
        />
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_03.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Terrain,
            type: 2,
          }}
          handler={handleToolSelection}
        />
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_04.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Terrain,
            type: 3,
          }}
          handler={handleToolSelection}
        />
      </Grid>
      <div style={{ height: 20 }} />
      {/*<Typography variant='body1'>Player</Typography>*/}
      <Grid container>
        <PlayerSelection
          image='/assets/graphics/units/blue/scifiUnit_07.png'
          onClick={() => setOwner(Owner.One)}
          currentOwner={currentOwner}
          owner={Owner.One}
        />
        <PlayerSelection
          image='/assets/graphics/units/red/scifiUnit_18.png'
          onClick={() => setOwner(Owner.Two)}
          currentOwner={currentOwner}
          owner={Owner.Two}
        />
      </Grid>
      <Typography variant='body2'>Buildings</Typography>
      <Grid container>
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_08.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Building,
            type: 0,
          }}
          handler={handleToolSelection}
        />
      </Grid>
      <Typography variant='body2'>Units</Typography>
      <Grid container>
        <PlacementTool
          image='/assets/graphics/terrain/scifiTile_07.png'
          currentTool={currentTool}
          toolData={{
            category: ToolCategory.Unit,
            type: 0,
          }}
          handler={handleToolSelection}
        />
      </Grid>
    </>
  )
}

const useSelectionStyles = makeStyles({
  selectionBlockContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  selectionOverlay: {
    position: 'absolute',
    top: '0%',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    pointerEvents: 'none',
    width: 44,
    height: 44,
  },
})
interface SelectionProps {
  image: string
  onClick: () => void
  currentOwner: Owner
  owner: Owner
}
const PlayerSelection: FC<SelectionProps> = ({
  image,
  onClick,
  currentOwner,
  owner,
}: SelectionProps): ReactElement => {
  const classes = useSelectionStyles()

  return (
    <Grid item xs={1}>
      <div className={classes.selectionBlockContainer}>
        <Spritesheet
          image={image}
          widthFrame={64}
          heightFrame={64}
          steps={1}
          fps={0}
          style={{ width: 40, height: 40 }}
          onClick={onClick}
        />
        {owner === currentOwner && (
          <img
            className={classes.selectionOverlay}
            src='/assets/graphics/cursor.png'
            alt='Player Select'
          />
        )}
      </div>
    </Grid>
  )
}
