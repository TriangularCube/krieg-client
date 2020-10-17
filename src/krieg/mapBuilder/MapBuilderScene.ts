import { KriegMap } from '../common/GameMap'
import { TerrainTile } from '../common/TerrainTile'
import { SceneData } from '../common/LoadingScene'
import { Clamp } from '../common/math'
import { TileSize } from '../common/GraphicsData'

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
    private port!: MessagePort

    private tile!: Phaser.GameObjects.Sprite

    private kriegMap!: KriegMap

    private terrainLayer!: Phaser.GameObjects.Sprite[][]

    private spacebar!: Phaser.Input.Keyboard.Key
    private keys!: { [key: string]: Phaser.Input.Keyboard.Key }

    private camera!: Phaser.Cameras.Scene2D.Camera

    public init(sceneData: MapSceneData): void {
        this.port = sceneData.port
        this.kriegMap = sceneData.kriegMap

        // TODO Generate Terrain Tiles

        this.port.postMessage('Finished Init')
    }

    public create(): void {
        this.camera = this.cameras.main

        this.SetupControls()

        const gameMap = this.kriegMap.gameMap

        // this.tile = new TerrainTile(0, this, 0, 0)

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
        this.camera.setBounds(
            0,
            0,
            /* BorderSize * 2 + */ TileSize * gameMap.width,
            /* BorderSize * 2 + */ TileSize * gameMap.height
        )
        // TODO: Figure out if we want borders around map edge

        this.port.onmessage = (message: MessageEvent) => {
            console.log(message.data)
        }

        this.port.postMessage('Finished Create')
    }

    private SetupControls(): void {
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

        this.input.on(
            'wheel',
            (
                pointer: unknown,
                currentlyOver: unknown,
                dx: number,
                dy: number
            ) => {
                this.cameras.main.setZoom(
                    Clamp((this.cameras.main.zoom -= dy / 100), 0.5, 1)
                )
            }
        )

        let clickPoint: ClickPoint | null = null

        this.input.on(
            Phaser.Input.Events.POINTER_DOWN,
            (pointer: PointerEvent): void => {
                clickPoint = {
                    camera: {
                        x: this.camera.scrollX,
                        y: this.camera.scrollY,
                    },
                    point: {
                        x: pointer.x,
                        y: pointer.y,
                    },
                }
            }
        )

        this.input.on(
            Phaser.Input.Events.POINTER_MOVE,
            (pointer: PointerEvent): void => {
                if (!clickPoint) {
                    return
                }

                this.camera.setScroll(
                    clickPoint.camera.x + (clickPoint.point.x - pointer.x),
                    clickPoint.camera.y + (clickPoint.point.y - pointer.y)
                )
            }
        )

        this.input.on(Phaser.Input.Events.POINTER_UP, (): void => {
            console.log('Pointer up')
            clickPoint = null
        })
        this.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, (): void => {
            console.log('Pointer Out')
            clickPoint = null
        })
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
