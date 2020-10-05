import { KriegMap } from '../common/GameMap'
import { TerrainAnimations } from '../common/LoadingData'
import { TerrainTile } from '../common/TerrainTile'
import { SceneData } from '../common/LoadingScene'

type MapSceneData = SceneData

export const MapBuilderSceneKey = 'Map Builder'
export class MapBuilderScene extends Phaser.Scene {
    private port!: MessagePort

    private tile!: Phaser.GameObjects.Sprite

    private kriegMap!: KriegMap

    private terrainLayer!: Phaser.GameObjects.Sprite[][]

    private spacebar!: Phaser.Input.Keyboard.Key

    public init(sceneData: SceneData): void {
        this.port = sceneData.port
        this.kriegMap = sceneData.kriegMap

        this.port.postMessage('Hi')
    }

    public create(): void {
        this.tile = new TerrainTile(0, this, 0, 0, 'Plains')

        this.spacebar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        )
    }

    public update(): void {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            // this.tile.destroy()
            this.scene.pause()
        }
    }
}
