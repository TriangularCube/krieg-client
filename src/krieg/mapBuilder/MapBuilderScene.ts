import { KriegMap } from '../common/GameMap'
import { TerrainTile } from '../common/TerrainTile'
import { SceneData } from '../common/LoadingScene'
import { Clamp } from '../common/math'
import { TileSize } from '../common/GraphicsData'
import { SceneMessageHandler } from '../../util/SceneMessages/SceneMessageHandler'
import {
  MessageType,
  ToolCategory,
  ToolType,
} from '../../util/SceneMessages/MessageTypes'
import {
  BuilderMouseController,
  EditorMouseEventType,
} from './BuilderMouseController'

import * as Phaser from 'phaser'

const Scene = Phaser.Scene
type Camera = Phaser.Cameras.Scene2D.Camera
type Sprite = Phaser.GameObjects.Sprite
type Key = Phaser.Input.Keyboard.Key
type Vector2 = Phaser.Math.Vector2

type MapSceneData = SceneData

export const MapBuilderSceneKey = 'Map Builder'
export class MapBuilderScene extends Scene {
  private comms!: SceneMessageHandler
  private kriegMap!: KriegMap

  private camera!: Camera
  private minZoom!: number

  private terrainLayer!: Sprite[][]

  private currentTool: ToolType | null

  private hoverIndicator!: Sprite

  // region Temp
  private spacebar!: Key
  private keys!: { [key: string]: Key }
  // endregion

  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)

    this.currentTool = null
  }

  public init(sceneData: MapSceneData): void {
    this.comms = new SceneMessageHandler(sceneData.port)
    this.kriegMap = sceneData.kriegMap
  }

  public create(): void {
    this.setupCamera()

    this.setupControls()

    this.setupMap()
    this.hoverIndicator = this.add.sprite(
      0.5 * TileSize,
      0.5 * TileSize,
      'cursor'
    )
    this.hoverIndicator.depth = 1

    this.comms.addListener(MessageType.Tool, data => (this.currentTool = data))
  }

  private setupCamera(): void {
    const gameMap = this.kriegMap.gameMap

    this.camera = this.cameras.main

    this.camera.setBounds(
      0,
      0,
      /* BorderSize * 2 + */ TileSize * gameMap.width,
      /* BorderSize * 2 + */ TileSize * gameMap.height
    )
    // TODO: Figure out if we want borders around map edge

    this.setMinZoom()
  }

  private setMinZoom(): void {
    const gameMap = this.kriegMap.gameMap

    const widthScale = this.camera.width / (gameMap.width * TileSize)
    const heightScale = this.camera.height / (gameMap.height * TileSize)

    const minScale = Math.max(widthScale, heightScale)
    this.minZoom = Math.max(minScale, 0.5)
  }

  private setupControls(): void {
    this.input.mouse.disableContextMenu()

    this.keys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
      confirm: 'a',
    }) as { [key: string]: Phaser.Input.Keyboard.Key }

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )

    const mouseController = new BuilderMouseController(
      this.input,
      this.kriegMap,
      this.camera
    )

    mouseController.addListener(EditorMouseEventType.Zoom, event => {
      this.camera.setZoom(
        Clamp(this.cameras.main.zoom - event / 1000, this.minZoom, 1)
      )
    })

    mouseController.addListener(
      EditorMouseEventType.Select,
      (coordinate: Vector2) => {
        if (!this.currentTool) {
          return
        }
        switch (this.currentTool.category) {
          case ToolCategory.Terrain:
            this.setTerrainAt(coordinate, this.currentTool.type)
            break
          case ToolCategory.Unit:
            console.log('Unit Placement')
            break
        }
      }
    )

    mouseController.addListener(EditorMouseEventType.Pan, (x, y) => {
      this.camera.setScroll(this.camera.scrollX - x, this.camera.scrollY - y)
    })

    mouseController.addListener(
      EditorMouseEventType.Hover,
      (coordinate: Vector2 | null) => {
        if (coordinate === null) {
          this.hoverIndicator.visible = false
          return
        }

        this.hoverIndicator.visible = true
        this.hoverIndicator.x = (coordinate.x + 0.5) * TileSize
        this.hoverIndicator.y = (coordinate.y + 0.5) * TileSize
      }
    )
  }

  private setupMap(): void {
    const gameMap = this.kriegMap.gameMap

    this.terrainLayer = Array(gameMap.width)
    for (let x = 0; x < gameMap.width; ++x) {
      this.terrainLayer[x] = Array(gameMap.height)

      for (let y = 0; y < gameMap.height; ++y) {
        this.terrainLayer[x][y] = new TerrainTile(
          gameMap.getTerrainAt(x, y),
          this,
          x,
          y
        )
      }
    }

    // TODO: Properly
  }

  public update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      // this.tile.destroy()
      // this.scene.pause()
      this.changeTool({
        category: ToolCategory.Terrain,
        type: 1,
      })
    }

    if (this.keys.down.isDown) {
      this.camera.setZoom(Clamp(this.cameras.main.zoom - 0.01, this.minZoom, 1))
    }
    if (this.keys.up.isDown) {
      this.camera.setZoom(Clamp(this.cameras.main.zoom + 0.01, this.minZoom, 1))
    }
  }

  private changeTool(tool: ToolType): void {
    this.currentTool = tool
    this.comms.postMessage(MessageType.Tool, tool)
  }

  private setTerrainAt(coordinate: Vector2, type: number) {
    const x = coordinate.x
    const y = coordinate.y

    this.terrainLayer[x][y].destroy()
    this.terrainLayer[x][y] = new TerrainTile(type, this, x, y)

    this.kriegMap.gameMap.setTerrainAt(x, y, type)
  }
}
