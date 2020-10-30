import { KriegMap } from '../common/GameMap'
import { TerrainTile } from '../common/TerrainTile'
import { SceneData } from '../common/LoadingScene'
import { Clamp } from '../common/math'
import { TileSize } from '../common/GraphicsData'
import { SceneMessageHandler } from '../../util/SceneMessages/SceneMessageHandler'
import { MessageType, ToolType } from '../../util/SceneMessages/MessageTypes'
import {
    EditorMouseController,
    EditorMouseEventType,
} from './EditorMouseController'

type MapSceneData = SceneData
interface ClickPoint {
    camera: {
        x: number
        y: number
    }
    point: {
        x: number
        y: number
    }
}

export const MapBuilderSceneKey = 'Map Builder'
export class MapBuilderScene extends Phaser.Scene {
    private comms!: SceneMessageHandler
    private kriegMap!: KriegMap

    private camera!: Phaser.Cameras.Scene2D.Camera
    private minZoom!: number

    private terrainLayer!: Phaser.GameObjects.Sprite[][]

    private currentTool: ToolType | null

    // region Temp
    private spacebar!: Phaser.Input.Keyboard.Key
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key }
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

        this.comms.addListener(MessageType.Tool, data => console.log(data))
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

        const mouseController = new EditorMouseController(
            this.input,
            this.kriegMap
        )

        mouseController.addListener(EditorMouseEventType.Zoom, event => {
            // console.log(event)
            // this.cameras.main.setZoom(
            //     Clamp((this.cameras.main.zoom -= dy / 100), this.minZoom, 1)
            // )
        })

        mouseController.addListener(EditorMouseEventType.Select, (x, y) => {
            console.log(x, y)
        })

        mouseController.addListener(EditorMouseEventType.Pan, (x, y) => {
            this.camera.setScroll(
                this.camera.scrollX - x,
                this.camera.scrollY - y
            )
        })

        // let clickPoint: ClickPoint | null = null
        //
        // this.input.on(
        //     Phaser.Input.Events.POINTER_DOWN,
        //     (pointer: PointerEvent): void => {
        //         console.log(pointer.button)
        //
        //         clickPoint = {
        //             camera: {
        //                 x: this.camera.scrollX,
        //                 y: this.camera.scrollY,
        //             },
        //             point: {
        //                 x: pointer.x,
        //                 y: pointer.y,
        //             },
        //         }
        //     }
        // )
        //
        // this.input.on(
        //     Phaser.Input.Events.POINTER_MOVE,
        //     (pointer: PointerEvent): void => {
        //         if (!clickPoint) {
        //             return
        //         }
        //
        //         this.camera.setScroll(
        //             clickPoint.camera.x + (clickPoint.point.x - pointer.x),
        //             clickPoint.camera.y + (clickPoint.point.y - pointer.y)
        //         )
        //     }
        // )
        //
        // this.input.on(Phaser.Input.Events.POINTER_UP, (): void => {
        //     console.log('Pointer up')
        //     clickPoint = null
        // })
        // this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, (): void => {
        //     console.log('Pointer Out')
        //     clickPoint = null
        // })
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
            this.scene.pause()
        }

        if (this.keys.down.isDown) {
            this.camera.zoom = Clamp(this.camera.zoom - 0.01, 0.5, 2)
        }
        if (this.keys.up.isDown) {
            this.camera.zoom = Clamp(this.camera.zoom + 0.01, 0.5, 2)
        }
    }
}
