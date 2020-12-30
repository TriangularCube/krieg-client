import React, { FC, ReactElement } from 'react'
import { ToolType } from '../../util/SceneMessages/MessageTypes'
import { Grid, makeStyles } from '@material-ui/core'
import { SelectionCursorPadding } from '../../krieg/common/GraphicsData'
import Spritesheet from 'react-responsive-spritesheet'

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
export const PlacementTool: FC<ToolProps> = ({
  image,
  toolData,
  currentTool,
  handler,
}: ToolProps): ReactElement => {
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
        {isCurrentTool && (
          <img
            className={classes.toolOverlay}
            src='/assets/graphics/cursor.png'
            alt='Selection Cursor'
          />
        )}
      </div>
    </Grid>
  )
}
